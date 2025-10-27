from flask import Blueprint, request, jsonify
from extensions import db
from models import Article
from schemas import ArticleSchema
from marshmallow import ValidationError

bp = Blueprint("articles", __name__, url_prefix="/api/articles")

# Add session=db.session for deserialization
article_schema = ArticleSchema(session=db.session)
article_list_schema = ArticleSchema(many=True, session=db.session)

@bp.route("/", methods=["GET"])
def list_articles():
    articles = Article.query.order_by(Article.created_at.desc()).all()
    result = article_list_schema.dump(articles)
    return jsonify(result)

@bp.route("/<int:article_id>", methods=["GET"])
def get_article(article_id):
    article = Article.query.get_or_404(article_id)
    result = article_schema.dump(article)
    return jsonify(result)

@bp.route("/", methods=["POST"])
def create_article():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400

    try:
        data = article_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400
    except ValueError as ve:
        return jsonify({"msg": str(ve)}), 400

    article = Article(
        title=data.title,
        content=data.content,
        author_id=data.author_id  # add any other fields required
    )
    db.session.add(article)
    db.session.commit()

    result = article_schema.dump(article)
    return jsonify(result), 201
