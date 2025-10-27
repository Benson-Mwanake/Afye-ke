from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt
from routes.auth import bp as auth_bp
from routes.clinics import bp as clinics_bp
from routes.bookings import bp as bookings_bp
from routes.chvs import bp as chvs_bp
from routes.articles import bp as articles_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(clinics_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(chvs_bp)
    app.register_blueprint(articles_bp)

    print("Registered Blueprints:", app.blueprints.keys())


    # simple root
    @app.route("/api/")
    def index():
        return jsonify({"msg":"AfyaLink KE API", "status":"ok"})

    # error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"msg":"Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"msg":"Server error", "detail": str(e)}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
