from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import Article
from utils import rbac_required

bp = Blueprint("articles", __name__)
api = Api(bp)


class ArticlesList(Resource):
    def get(self):
        items = Article.query.order_by(Article.created_at.desc()).all()
        return [
            {
                "id": a.id,
                "title": a.title,
                "category": a.category,
                "author": a.author,
                "date": a.date,
                "readTime": a.read_time,
                "image": a.image,
                "summary": a.summary,
                "content": a.content,
                "published": a.published,
                "isTrending": a.is_trending,
            }
            for a in items
        ]

    @rbac_required("articles:write")
    def post(self):
        data = request.get_json() or {}
        a = Article(
            title=data.get("title"),
            category=data.get("category"),
            author=data.get("author"),
            date=data.get("date"),
            read_time=data.get("readTime"),
            image=data.get("image"),
            summary=data.get("summary"),
            content=data.get("content"),
            published=data.get("published", True),
            is_trending=data.get("isTrending", False),
        )
        db.session.add(a)
        db.session.commit()
        return {"id": a.id}, 201


api.add_resource(ArticlesList, "/")
