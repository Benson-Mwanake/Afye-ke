from flask import Blueprint, request, jsonify
from extensions import db
from models import Article
from schemas import ArticleSchema
from marshmallow import ValidationError

bp = Blueprint("articles", __name__, url_prefix="/api/articles")
article_schema = ArticleSchema(session=db.session)
article_list_schema = ArticleSchema(many=True, session=db.session)

@bp.route("/", methods=["GET"])
def list_articles():
    articles = Article.query.order_by(Article.date.desc()).all()
    return jsonify(article_list_schema.dump(articles))

@bp.route("/", methods=["POST"])
def create_article():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400
    try:
        data = article_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400
    article = Article(**data)
    db.session.add(article)
    db.session.commit()
    return jsonify(article_schema.dump(article)), 201
