from flask_restful import Resource
from flask import request, current_app, jsonify
import openai
from extensions import db
from models import SymptomHistory
from schemas import SymptomHistorySchema
from flask_jwt_extended import jwt_required, get_jwt_identity

symptom_schema = SymptomHistorySchema()


class OpenAIResource(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json() or {}
        description = data.get("description", "")
        selected = data.get("selectedSymptoms", [])
        userId = get_jwt_identity()

        if not (description or selected):
            return {"msg": "Provide description or selectedSymptoms"}, 400

        openai.api_key = current_app.config.get("OPENAI_API_KEY")
        if not openai.api_key:
            return {"msg": "OpenAI API key not configured on server"}, 500

        prompt = f"You are a Kenyan medical assistant. Symptoms: {', '.join(selected)}. {description}"

        try:
            resp = openai.ChatCompletion.create(
                model=current_app.config.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {
                        "role": "system",
                        "content": "You are a strict medical assistant for Kenya - return JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                max_tokens=600,
            )
            raw = resp.choices[0].message.content.strip()
            import re, json

            m = re.search(r"\{[\s\S]*\}", raw)
            parsed = json.loads(m.group(0)) if m else json.loads(raw)
        except Exception as e:
            return {"msg": "OpenAI error", "error": str(e)}, 500

        try:
            hist = SymptomHistory(
                user_id=userId, symptoms=", ".join(selected), result=parsed
            )
            db.session.add(hist)
            db.session.commit()
        except Exception:
            db.session.rollback()

        return parsed, 200
