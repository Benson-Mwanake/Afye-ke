# server/routes/clinics.py
from flask import Blueprint, jsonify, request
from models import Clinic, User, Review
from schemas import ClinicSchema
from extensions import db
from flask_jwt_extended import create_access_token
from datetime import datetime

bp = Blueprint("clinics", __name__, url_prefix="/clinics")

clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)


# ---------------------------------
# 🔹 Helper: check if clinic is open now
# ---------------------------------
def is_open_now(operating_hours):
    if not operating_hours:
        return False
    now = datetime.now()
    today = now.strftime("%A")
    for day_info in operating_hours:
        if day_info.get("day") == today:
            if day_info.get("closed"):
                return False
            try:
                open_time = datetime.strptime(day_info["open"], "%H:%M").time()
                close_time = datetime.strptime(day_info["close"], "%H:%M").time()
                return open_time <= now.time() <= close_time
            except:
                return False
    return False


# ---------------------------------
# 🔹 List all clinics with optional filters
# ---------------------------------
@bp.route("/", methods=["GET"])
def list_clinics():
    q = Clinic.query
    limit = request.args.get("_limit", type=int)
    filter_type = request.args.get("filter")
    status = request.args.get("status")

    if status:
        q = q.filter_by(status=status)

    if limit:
        items = q.limit(limit).all()
    else:
        items = q.all()

    result = clinics_schema.dump(items)

    # Add open_now and 24/7 flags dynamically
    for c in result:
        hours = c.get("operating_hours") or []  # FIXED: DEFAULT TO []
        c["is_open_now"] = is_open_now(hours)

        c["is_24_7"] = len(hours) == 7 and all(
            d.get("open") == "00:00" and d.get("close") == "23:59"
            for d in hours
            if "day" in d
        )

    # Apply filter logic
    if filter_type == "open_now":
        result = [x for x in result if x["is_open_now"]]
    elif filter_type == "24_7":
        result = [x for x in result if x["is_24_7"]]
    elif filter_type == "highest_rated":
        result = sorted(result, key=lambda x: x.get("rating", 0), reverse=True)

    return jsonify(result)


# ---------------------------------
# 🔹 Get single clinic by ID
# ---------------------------------
@bp.route("/<int:clinic_id>", methods=["GET"])
def get_clinic(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    data = clinic_schema.dump(clinic)
    hours = data.get("operating_hours") or []  # FIXED
    data["is_open_now"] = is_open_now(hours)
    return jsonify(data)


# ---------------------------------
# 🔹 Clinic login
# ---------------------------------
@bp.route("/login", methods=["POST"])
def clinic_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Authenticate against the User table for role="clinic"
    user = User.query.filter_by(email=email, role="clinic").first()
    if not user:
        return jsonify({"message": "Clinic not found. Please log in as a clinic."}), 404

    if not user.check_password(password):
        return jsonify({"message": "Incorrect password"}), 401

    # Generate JWT token
    token = create_access_token(identity={"id": user.id, "role": user.role})

    return jsonify(
        {
            "message": "Login successful",
            "token": token,
            "clinic": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "phone": user.phone_number,
            },
        }
    )


# ---------------------------------
# 🔹 Get all reviews for a specific clinic
# ---------------------------------
@bp.route("/<int:clinic_id>/reviews", methods=["GET"])
def get_reviews(clinic_id):
    reviews = Review.query.filter_by(clinic_id=clinic_id).all()
    return jsonify(
        [
            {
                "id": r.id,
                "user_id": r.user_id,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at.strftime("%Y-%m-%d %H:%M"),
            }
            for r in reviews
        ]
    )


# ---------------------------------
# 🔹 Add a new review to a clinic
# ---------------------------------
@bp.route("/<int:clinic_id>/reviews", methods=["POST"])
def add_review(clinic_id):
    data = request.get_json()
    rating = data.get("rating")
    comment = data.get("comment", "")
    user_id = data.get("user_id")

    if not rating or not user_id:
        return jsonify({"message": "Rating and user_id are required"}), 400

    new_review = Review(
        clinic_id=clinic_id,
        user_id=user_id,
        rating=rating,
        comment=comment,
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({"message": "Review added successfully"}), 201


# ---------------------------------
# 🔹 PATCH route: Approve / Reject clinic (FIXED URL)
# ---------------------------------
@bp.route("/<int:clinic_id>/status", methods=["PATCH"])
def update_clinic_status(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    data = request.get_json()

    new_status = data.get("status")
    verified = data.get("verified")

    if new_status not in ["approved", "rejected", "pending"]:
        return jsonify({"error": "Invalid status"}), 400

    clinic.status = new_status
    clinic.verified = bool(verified)

    db.session.commit()

    return (
        jsonify(
            {
                "message": f"Clinic {clinic.name} updated to {new_status}",
                "clinic": clinic_schema.dump(clinic),
            }
        ),
        200,
    )
