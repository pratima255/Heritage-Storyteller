from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    password = data.get('password')
    confirm_password = data.get('confirmPassword') or data.get('confirm_password')
    raw_role = (data.get('role') or 'Student').strip()
    role = 'Admin' if raw_role.lower() == 'admin' else 'Student'

    if not name or not password:
        return jsonify({'success': False, 'message': 'Name and password are required'}), 400

    if confirm_password and password != confirm_password:
        return jsonify({'success': False, 'message': 'Passwords do not match'}), 400

    existing_user = User.query.filter(db.func.lower(User.name) == name.lower()).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Name already exists'}), 400

    user = User(
        name=name,
        role=role,
        xp=0
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'data': {
            'token': access_token,
            'user': user.to_dict()
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    password = data.get('password')

    if not name or not password:
        return jsonify({'success': False, 'message': 'Name and password are required'}), 400

    user = User.query.filter(db.func.lower(User.name) == name.lower()).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'data': {
            'token': access_token,
            'user': user.to_dict()
        }
    }), 200



@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    return jsonify({
        'success': True,
        'data': {
            'user': user.to_dict()
        }
    }), 200

