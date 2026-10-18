from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from extensions import db
from models.user import User

def admin_required():
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = db.session.get(User, int(current_user_id))
            if not user or user.role != 'admin':
                return jsonify({'success': False, 'message': 'Admin privilege required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
