from flask import Blueprint, jsonify
from models import Report

bp = Blueprint("reports", __name__, url_prefix="/reports")

@bp.route("/", methods=["GET"])
def get_reports():
    reports = Report.query.all()
    data = []
    for r in reports:
        data.append({
            "id": r.id,
            "title": r.title,
            "category": r.category,
            "author": r.author,
            "date": r.date,
            "summary": r.summary,
            "content": r.content
        })
    return jsonify(data)
