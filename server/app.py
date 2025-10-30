from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from extensions import db, ma, jwt

# Blueprints
from routes.auth import bp as auth_bp
from routes.clinics import bp as clinics_bp
from routes.articles import bp as articles_bp
from routes.appointments import bp as appointments_bp
from routes.users import bp as users_bp
from routes.misc import bp as misc_bp
from routes.reports import bp as reports_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow CORS
    CORS(app)

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            return jsonify(success=True), 200

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(clinics_bp)
    app.register_blueprint(articles_bp)
    app.register_blueprint(appointments_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(misc_bp)
    app.register_blueprint(reports_bp)

    @app.route("/")
    def index():
        return jsonify({"message": "AfyaLink API running"})

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
