from flask import Blueprint, request, jsonify
from extensions import db
from models import CHV
from schemas import CHVSchema
from marshmallow import ValidationError

bp = Blueprint("chvs", __name__, url_prefix="/api/chvs")
chv_schema = CHVSchema(session=db.session)
chv_list_schema = CHVSchema(many=True, session=db.session)

@bp.route("/", methods=["GET"])
def list_chvs():
    chvs = CHV.query.all()
    return jsonify(chv_list_schema.dump(chvs))

@bp.route("/", methods=["POST"])
def create_chv():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400
    try:
        data = chv_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400
    chv = CHV(**data)
    db.session.add(chv)
    db.session.commit()
    return jsonify(chv_schema.dump(chv)), 201
