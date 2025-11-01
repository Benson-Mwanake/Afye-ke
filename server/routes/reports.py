# server/routes/reports.py
from flask import Blueprint, jsonify, request
from extensions import db
from models import Report, User
from flask_jwt_extended import jwt_required

bp = Blueprint("reports", __name__, url_prefix="/reports")


@bp.route("/", methods=["GET"])
@jwt_required()
def get_reports():
    reports = Report.query.all()
    data = []

    for r in reports:
        try:
            submitter = User.query.get(r.submitted_by_id) if r.submitted_by_id else None
            data.append({
                "id": r.id,
                "title": r.title or "Untitled",
                "category": r.category or "General",
                "date": r.date.isoformat() if r.date else None,
                "status": r.status or "Pending",
                "summary": r.summary or "",
                "content": r.content or "",
                "submittedBy": {
                    "id": submitter.id if submitter else None,
                    "name": submitter.full_name if submitter else "Unknown"
                }
            })
        except Exception as e:
            print(f"Error processing report {r.id}: {e}")
            continue

    return jsonify(data), 200

# ✅ Update report status (Pending → Reviewed)
@bp.route("/<int:report_id>", methods=["PATCH"])
@jwt_required()
def update_report_status(report_id):
    report = Report.query.get_or_404(report_id)
    data = request.get_json()

    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Missing status"}), 400

    report.status = new_status
    db.session.commit()

    return jsonify({"message": "Report status updated", "status": new_status}), 200
