"""
CareBridge Flask Backend
Entry point — app factory pattern
"""
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from app.extensions import db, jwt, migrate
from app.config import config_by_name

def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_URL"]}})

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.caregivers import caregivers_bp
    from app.routes.requests import requests_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp,       url_prefix="/api/auth")
    app.register_blueprint(caregivers_bp, url_prefix="/api/caregivers")
    app.register_blueprint(requests_bp,   url_prefix="/api/requests")
    app.register_blueprint(users_bp,      url_prefix="/api/users")

    # Health check
    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "carebridge-api"}

    return app