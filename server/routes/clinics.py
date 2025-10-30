from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import Clinic
from schemas import ClinicSchema
from utils import rbac_required, paginate_query

bp = Blueprint("clinics", __name__)
api = Api(bp)

clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)


class ClinicsList(Resource):
    def get(self):
        # Support _limit for frontend health probe
        limit = request.args.get("_limit")
        if limit:
            try:
                items = Clinic.query.limit(int(limit)).all()
                return clinics_schema.dump(items)
            except:
                pass
        page = request.args.get("page", 1)
        per_page = request.args.get("per_page")
        q = Clinic.query.order_by(Clinic.name)
        p = paginate_query(q, page, per_page)
        return {
            "items": clinics_schema.dump(p["items"]),
            "total": p["total"],
            "pages": p["pages"],
            "page": p["page"],
            "per_page": p["per_page"],
        }

    @rbac_required("clinics:write")
    def post(self):
        data = request.get_json() or {}
        clinic = clinic_schema.load(data)
        db.session.add(clinic)
        db.session.commit()
        return clinic_schema.dump(clinic), 201


class ClinicDetail(Resource):
    def get(self, clinic_id):
        c = Clinic.query.get_or_404(clinic_id)
        return clinic_schema.dump(c), 200

    @rbac_required("clinics:write")
    def patch(self, clinic_id):
        c = Clinic.query.get_or_404(clinic_id)
        data = request.get_json() or {}
        for k, v in data.items():
            if hasattr(c, k):
                setattr(c, k, v)
        db.session.commit()
        return clinic_schema.dump(c), 200

    @rbac_required("clinics:write")
    def delete(self, clinic_id):
        c = Clinic.query.get_or_404(clinic_id)
        db.session.delete(c)
        db.session.commit()
        return {"msg": "deleted"}, 204


api.add_resource(ClinicsList, "/")
api.add_resource(ClinicDetail, "/<int:clinic_id>")
