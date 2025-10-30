from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import Image

bp = Blueprint("images", __name__)
api = Api(bp)


class Upload(Resource):
    def post(self):
        # Mock upload: accept a url or file, but do not contact Cloudinary
        # Frontend should send an image file; here we simply store a placeholder
        clinic_id = request.form.get("clinic_id")
        uploaded_by = request.form.get("uploaded_by")
        url = request.form.get("url") or "https://via.placeholder.com/400"
        img = Image(
            public_id="mock",
            url=url,
            clinic_id=int(clinic_id) if clinic_id else None,
            uploaded_by=uploaded_by,
            meta_data={},
        )
        db.session.add(img)
        db.session.commit()
        return {"id": img.id, "url": img.url}, 201


api.add_resource(Upload, "/upload")
