from functools import wraps
from flask import jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from extensions import db

PERMISSIONS = {
    "admin": {
        "users:read",
        "users:write",
        "clinics:read",
        "clinics:write",
        "appointments:write",
        "articles:write",
        "images:write",
    },
    "manager": {"clinics:read", "clinics:write", "appointments:write", "images:write"},
    "clinic": {"clinics:read", "appointments:write"},
    "patient": {"clinics:read", "appointments:write"},
}


def rbac_required(permission):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request(optional=False)
            claims = get_jwt()
            role = claims.get("role")
            if not role:
                return jsonify({"msg": "Missing role"}), 403
            allowed = PERMISSIONS.get(role, set())
            if permission not in allowed:
                return jsonify({"msg": "Forbidden"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def paginate_query(query, page, per_page):
    try:
        page = max(1, int(page or 1))
    except:
        page = 1
    per_page = int(per_page or current_app.config.get("ITEMS_PER_PAGE", 12))
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": pagination.items,
        "total": pagination.total,
        "pages": pagination.pages,
        "page": pagination.page,
        "per_page": pagination.per_page,
    }
