import os
from datetime import timedelta
from dotenv import load_dotenv

# Explicitly load environment variables from backend/.env if available
basedir = os.path.abspath(os.path.dirname(__file__))
backend_env = os.path.join(basedir, '.env')
if os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    PORT = int(os.getenv("PORT", 5000))

    # Validate required environment variables at startup
    missing_vars = []
    if not SECRET_KEY:
        missing_vars.append("SECRET_KEY")
    if not DATABASE_URL:
        missing_vars.append("DATABASE_URL")
    if not JWT_SECRET_KEY:
        missing_vars.append("JWT_SECRET_KEY")

    if missing_vars:
        raise RuntimeError(
            f"Missing required environment variable(s): {', '.join(missing_vars)}. "
            "Please configure them in backend/.env (refer to backend/.env.example)."
        )

    # Normalize PostgreSQL URL scheme if needed
    raw_db_url = DATABASE_URL
    if raw_db_url.startswith("postgresql://"):
        raw_db_url = raw_db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    SQLALCHEMY_DATABASE_URI = raw_db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
