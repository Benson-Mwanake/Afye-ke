from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import SymptomHistory

bp = Blueprint("symptoms", __name__)
api = Api(bp)


class SymptomList(Resource):
    def post(self):
        data = request.get_json() or {}
        # userId in frontend is string - convert if numeric
        user_id = data.get("userId") or data.get("user_id")
        try:
            user_id = int(user_id)
        except:
            user_id = 0
        s = SymptomHistory(
            user_id=user_id,
            symptoms=data.get("symptoms"),
            result=data.get("result"),
            timestamp=data.get("timestamp"),
        )
        db.session.add(s)
        db.session.commit()
        return {"msg": "saved", "id": s.id}, 201


api.add_resource(SymptomList, "/symptomHistory")
