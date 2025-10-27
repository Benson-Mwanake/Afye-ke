from flask import Blueprint, request, jsonify
from extensions import db
from models import Clinic, User
from schemas import ClinicSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
import math

bp = Blueprint("clinics", __name__, url_prefix="/api/clinics")
clinic_schema = ClinicSchema()
clinic_list_schema = ClinicSchema(many=True)

# helper: haversine distance in km
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

@bp.route("/", methods=["GET"])
def list_clinics():
    clinics = Clinic.query.all()
    return jsonify(clinic_list_schema.dump(clinics))

@bp.route("/<int:clinic_id>", methods=["GET"])
def get_clinic(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    return clinic_schema.jsonify(clinic)

@bp.route("/search", methods=["GET"])
def search_clinics():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    radius_km = request.args.get("radius_km", default=10, type=float)
    clinics = Clinic.query.all()
    if lat is not None and lng is not None:
        filtered = []
        for c in clinics:
            if c.lat is None or c.lng is None:
                continue
            dist = haversine(lat, lng, c.lat, c.lng)
            if dist <= radius_km:
                obj = clinic_schema.dump(c)
                obj["distance_km"] = round(dist, 2)
                filtered.append(obj)
        return jsonify(filtered)
    return clinic_list_schema.jsonify(clinics)

@bp.route("/<int:clinic_id>/save", methods=["POST"])
@jwt_required()
def toggle_save_clinic(clinic_id):
    uid = get_jwt_identity()
    user = User.query.get(uid)
    clinic = Clinic.query.get_or_404(clinic_id)
    if clinic in user.saved_clinics:
        user.saved_clinics.remove(clinic)
        db.session.commit()
        return jsonify({"msg":"Clinic removed from saved list"})
    else:
        user.saved_clinics.append(clinic)
        db.session.commit()
        return jsonify({"msg":"Clinic saved"})

@bp.route("/", methods=["POST"])
def create_clinic():
    json_data = request.get_json()
    try:
        data = clinic_schema.load(json_data)
    except Exception as e:
        return jsonify({"msg":"Validation error", "errors": e.messages}), 400
    clinic = Clinic(**data)
    db.session.add(clinic)
    db.session.commit()
    return clinic_schema.jsonify(clinic), 201
