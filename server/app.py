from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt
from flask_cors import CORS

# route blueprints
from routes.auth import bp as auth_bp
from routes.users import bp as users_bp
from routes.clinics import bp as clinics_bp
from routes.appointments import bp as appointments_bp
from routes.articles import bp as articles_bp
from routes.symptoms import bp as symptoms_bp
from routes.health import bp as health_bp
from routes.images import bp as images_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # register blueprint endpoints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(clinics_bp, url_prefix="/clinics")
    app.register_blueprint(appointments_bp, url_prefix="/appointments")
    app.register_blueprint(articles_bp, url_prefix="/articles")
    app.register_blueprint(symptoms_bp, url_prefix="")
    app.register_blueprint(health_bp, url_prefix="")
    app.register_blueprint(images_bp, url_prefix="/api/images")

    @app.route("/")
    def index():
        return jsonify({"msg": "AfyaLink backend"}), 200

    return app


if __name__ == "__main__":
    create_app().run(host="0.0.0.0", port=5000, debug=True)
