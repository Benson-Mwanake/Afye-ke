from flask import Blueprint, request, jsonify
from extensions import db
from models import CHV
from schemas import CHVSchema
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
import uuid

bp = Blueprint("chvs", __name__, url_prefix="/api/chvs")
chv_schema = CHVSchema(session=db.session)
chv_list_schema = CHVSchema(many=True, session=db.session)

# ---------------------------
# Decorators
# ---------------------------
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admins only"}), 403
        return fn(*args, **kwargs)
    return wrapper

# ---------------------------
# Routes
# ---------------------------

# GET all CHVs
@bp.route("/", methods=["GET"])
def list_chvs():
    chvs = CHV.query.all()
    return jsonify(chv_list_schema.dump(chvs))

# Create a new CHV (admin only)
@bp.route("/", methods=["POST"])
@admin_required
def create_chv():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400
    try:
        # load returns a CHV instance directly
        chv = chv_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400

    db.session.add(chv)
    db.session.commit()
    return jsonify(chv_schema.dump(chv)), 201

# Update CHV (admin only)
@bp.route("/<chv_id>", methods=["PUT"])
@admin_required
def update_chv(chv_id):
    chv = CHV.query.get_or_404(chv_id)
    json_data = request.get_json()
    try:
        updated_chv = chv_schema.load(json_data, instance=chv, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400

    db.session.commit()
    return jsonify(chv_schema.dump(updated_chv)), 200

# Delete CHV (admin only)
@bp.route("/<chv_id>", methods=["DELETE"])
@admin_required
def delete_chv(chv_id):
    chv = CHV.query.get_or_404(chv_id)
    db.session.delete(chv)
    db.session.commit()
    return jsonify({"msg": "CHV deleted"}), 200
