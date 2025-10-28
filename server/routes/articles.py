from flask import Blueprint, request, jsonify
from extensions import db
from models import Article, User
from schemas import ArticleSchema
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required, get_jwt
from uuid import uuid4
from functools import wraps

bp = Blueprint("articles", __name__, url_prefix="/api/articles")
article_schema = ArticleSchema(session=db.session)
article_list_schema = ArticleSchema(many=True, session=db.session)

# ---------------------------
# Decorators
# ---------------------------
def clinic_or_admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin", "clinic", "Admin", "Clinic"]:
            return jsonify({"msg": "Admins or clinics only"}), 403
        return fn(*args, **kwargs)
    return wrapper

# ---------------------------
# Routes
# ---------------------------

# GET all articles
@bp.route("/", methods=["GET"])
def list_articles():
    articles = Article.query.order_by(Article.date.desc()).all()
    return jsonify(article_list_schema.dump(articles))

# POST new article (admin or clinic only)
@bp.route("/", methods=["POST"])
@clinic_or_admin_required
def create_article():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400

    try:
        # Use session=db.session to get an Article instance
        article = article_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400

    db.session.add(article)
    db.session.commit()
    return jsonify(article_schema.dump(article)), 201

# PUT / update article (admin or clinic only)
@bp.route("/<uuid:article_id>", methods=["PUT"])
@clinic_or_admin_required
def update_article(article_id):
    article = Article.query.get_or_404(article_id)
    json_data = request.get_json()
    try:
        updated_article = article_schema.load(json_data, instance=article, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400

    db.session.commit()
    return jsonify(article_schema.dump(updated_article)), 200

# DELETE article (admin only)
@bp.route("/<uuid:article_id>", methods=["DELETE"])
@jwt_required()
def delete_article(article_id):
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"msg": "Admins only"}), 403

    article = Article.query.get_or_404(article_id)
    db.session.delete(article)
    db.session.commit()
    return jsonify({"msg": "Article deleted"}), 200
