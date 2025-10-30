from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import User
from utils import rbac_required, paginate_query

bp = Blueprint("users", __name__)
api = Api(bp)


def user_public(u):
    return {
        "id": u.id,
        "fullName": u.full_name,
        "email": u.email,
        "phoneNumber": u.phone_number,
        "role": u.role,
        "clinicId": u.clinic_id,
        "profile": u.profile or {},
        "savedClinics": u.saved_clinics or [],
        "blocked": u.blocked,
    }


class UsersList(Resource):
    @rbac_required("users:read")
    def get(self):
        page = request.args.get("page", 1)
        per_page = request.args.get("per_page")
        q = User.query.order_by(User.created_at.desc())
        p = paginate_query(q, page, per_page)
        return {
            "items": [user_public(u) for u in p["items"]],
            "total": p["total"],
            "pages": p["pages"],
            "page": p["page"],
            "per_page": p["per_page"],
        }


class UserDetail(Resource):
    def get(self, user_id):
        u = User.query.get_or_404(user_id)
        return user_public(u), 200

    def patch(self, user_id):
        u = User.query.get_or_404(user_id)
        data = request.get_json() or {}
        if "savedClinics" in data:
            u.saved_clinics = data["savedClinics"]
        if "profile" in data:
            u.profile = data["profile"]
        if "fullName" in data:
            u.full_name = data["fullName"]
        if "phoneNumber" in data:
            u.phone_number = data["phoneNumber"]
        db.session.commit()
        return user_public(u), 200

    @rbac_required("users:write")
    def delete(self, user_id):
        u = User.query.get_or_404(user_id)
        db.session.delete(u)
        db.session.commit()
        return {"msg": "deleted"}, 204


api.add_resource(UsersList, "/")
api.add_resource(UserDetail, "/<int:user_id>")
