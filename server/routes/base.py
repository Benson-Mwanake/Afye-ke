# resources/base.py
from flask_restful import Resource
from flask import request
from extensions import db
from utils import json_server_paginate, require_json, jwt_optional
from sqlalchemy import asc, desc


class CRUDResource(Resource):
    def __init__(self, model, schema):
        self.model = model
        self.schema = schema

    @jwt_optional
    def get(self, id=None):
        if id:
            obj = db.session.get(self.model, id)
            if not obj:
                return {"msg": "Not found"}, 404
            return self.schema.dump(obj), 200

        pagination = json_server_paginate(self.model.query)
        return {
            "data": self.schema.dump(pagination["items"], many=True),
            "_page": pagination["page"],
            "_limit": pagination["limit"],
            "_total": pagination["total"],
        }, 200

    @require_json
    @jwt_optional
    def post(self):
        data = request.get_json()
        obj = self.model(**data)
        db.session.add(obj)
        db.session.commit()
        return self.schema.dump(obj), 201

    @require_json
    @jwt_optional
    def patch(self, id):
        obj = db.session.get(self.model, id)
        if not obj:
            return {"msg": "Not found"}, 404
        data = request.get_json()
        for k, v in data.items():
            if hasattr(obj, k):
                setattr(obj, k, v)
        db.session.commit()
        return self.schema.dump(obj), 200

    @jwt_optional
    def delete(self, id):
        obj = db.session.get(self.model, id)
        if not obj:
            return {"msg": "Not found"}, 404
        db.session.delete(obj)
        db.session.commit()
        return {"msg": "deleted"}, 200
