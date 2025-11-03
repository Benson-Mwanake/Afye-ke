from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Article, User
from schemas import ArticleSchema

bp = Blueprint("articles", __name__, url_prefix="/articles")
article_schema = ArticleSchema()
articles_schema = ArticleSchema(many=True)

@bp.route("/", methods=["GET"])
def get_articles():
    q = Article.query.order_by(Article.created_at.desc())
    return jsonify(articles_schema.dump(q.all()))

@bp.route("/", methods=["POST"])
@jwt_required()
def create_article():
    user_id = int(get_jwt_identity())
    role    = get_jwt().get("role")
    current_user = User.query.get(user_id)
    if not current_user:
        return jsonify({"msg": "User not found"}), 404

    if current_user.role not in ["admin", "manager", "clinic"]:
        return jsonify({"msg": "Not authorized to create articles"}), 403

    payload = request.get_json() or {}
    article = Article(
        title=payload.get("title"),
        category=payload.get("category"),
        author=payload.get("author") or getattr(current_user, "full_name", current_user.email),
        date=payload.get("date"),
        read_time=payload.get("readTime"),
        image=payload.get("image"),
        summary=payload.get("summary"),
        content=payload.get("content"),
        published=payload.get("published", True),
        is_trending=payload.get("isTrending", False),
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(article_schema.dump(article)), 201


@bp.route("/<int:article_id>", methods=["DELETE"])
@jwt_required()
def delete_article(article_id):
    current_user = User.query.get(get_jwt_identity())
    if not current_user or current_user.role != "admin":
        return jsonify({"msg": "Admin only"}), 403

    article = Article.query.get_or_404(article_id)
    db.session.delete(article)
    db.session.commit()
    return jsonify({"msg": "Article deleted"}), 200
@bp.route("/<int:article_id>", methods=["PATCH"])
@jwt_required()
def update_article(article_id):
    user_id = int(get_jwt_identity())
    role    = get_jwt().get("role")
    current_user = User.query.get(user_id)

    if not current_user:
        return jsonify({"msg": "User not found"}), 404

    # only admin clinic can edit
    if current_user.role not in ["admin", "manager", "clinic"]:
        return jsonify({"msg": "Not authorized"}), 403

    article = Article.query.get_or_404(article_id)
    payload = request.get_json() or {}

    # update only allowed fields
    for field in ["title", "category", "author", "date", "read_time", "image", "summary", "content", "published", "is_trending"]:
        if field in payload:
            setattr(article, field, payload[field])

    db.session.commit()
    return jsonify(article_schema.dump(article))
