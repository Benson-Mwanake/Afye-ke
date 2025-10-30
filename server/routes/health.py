from flask import Blueprint
from flask_restful import Api, Resource
from datetime import datetime
from models import Clinic

bp = Blueprint("health", __name__)
api = Api(bp)


class Health(Resource):
    def get(self):
        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "version": "1.0.0",
        }, 200


class ClinicsProbe(Resource):
    def get(self):
        limit = request.args.get("_limit")
        if limit:
            try:
                return [
                    {"id": c.id, "name": c.name}
                    for c in Clinic.query.limit(int(limit)).all()
                ], 200
            except:
                pass
        # fallback: return first 20
        return [{"id": c.id, "name": c.name} for c in Clinic.query.limit(20).all()], 200


api.add_resource(Health, "/health")
api.add_resource(ClinicsProbe, "/clinics")
