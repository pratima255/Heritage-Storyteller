from .auth import auth_bp
from .topics import topics_bp
from .stories import stories_bp
from .quizzes import quizzes_bp
from .games import games_bp
from .progress import progress_bp
from .admin import admin_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(topics_bp)
    app.register_blueprint(stories_bp)
    app.register_blueprint(quizzes_bp)
    app.register_blueprint(games_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(admin_bp)
