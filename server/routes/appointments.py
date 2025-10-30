from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import Appointment
from utils import rbac_required

bp = Blueprint("appointments", __name__)
api = Api(bp)


class AppointmentList(Resource):
    def get(self):
        items = Appointment.query.order_by(Appointment.date.desc()).all()
        return [
            {
                "id": a.id,
                "patientId": a.patient_id,
                "clinicId": a.clinic_id,
                "clinicName": a.clinic_name,
                "doctor": a.doctor,
                "service": a.service,
                "date": a.date,
                "time": a.time,
                "status": a.status,
                "notes": a.notes,
            }
            for a in items
        ]

    def post(self):
        data = request.get_json() or {}
        a = Appointment(
            patient_id=int(data.get("patientId")),
            clinic_id=int(data.get("clinicId")),
            clinic_name=data.get("clinicName"),
            doctor=data.get("doctor"),
            service=data.get("service"),
            date=data.get("date"),
            time=data.get("time"),
            status=data.get("status"),
            notes=data.get("notes"),
        )
        db.session.add(a)
        db.session.commit()
        return {"msg": "created", "id": a.id}, 201


api.add_resource(AppointmentList, "/")
