from flask import Blueprint, request, jsonify
from extensions import db
from models import SymptomHistory
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("misc", __name__)

@bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@bp.route("/openai/analyze", methods=["POST"])
@jwt_required(optional=True)
def analyze():
    # Simple stub: frontend expects a JSON with results
    data = request.get_json() or {}
    description = data.get("description", "")
    selected = data.get("selectedSymptoms", [])
    # Mock response
    res = {
        "summary": "Mock analysis result",
        "possibleConditions": ["Common Cold", "Allergy"] if selected else ["No clear match"],
        "advice": "Visit a clinic if symptoms persist"
    }
    return jsonify(res)

@bp.route("/symptomHistory", methods=["POST"])
@jwt_required()
def save_symptom_history():
    data = request.get_json() or {}
    user_id = data.get("userId") or get_jwt_identity()
    sh = SymptomHistory(
        user_id=user_id,
        symptoms=data.get("symptoms"),
        result=data.get("result", {}),
        timestamp=data.get("timestamp")
    )
    db.session.add(sh)
    db.session.commit()
    return jsonify({"msg": "Saved", "id": sh.id}), 201
