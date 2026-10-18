from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.heritage_topic import HeritageTopic
from models.game import GameItem
from services.xp_service import award_xp
from services.progress_service import get_or_create_progress
from services.achievement_service import check_and_award_achievements

games_bp = Blueprint('games', __name__, url_prefix='/api/games')

@games_bp.route('/artifact-match/<topic_id>', methods=['GET'])
def get_artifact_match_game(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    items = GameItem.query.filter_by(topic_id=topic_id, game_type='artifact_match').all()
    return jsonify({
        'success': True,
        'count': len(items),
        'data': [item.to_dict() for item in items]
    }), 200


@games_bp.route('/artifact-match/<topic_id>/submit', methods=['POST'])
@jwt_required()
def submit_artifact_match_game(topic_id):
    user_id = int(get_jwt_identity())
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    data = request.get_json() or {}
    score = data.get('score', 100)

    progress = get_or_create_progress(user_id, topic_id)
    first_time = (progress.artifact_game_score == 0)
    
    if score > progress.artifact_game_score:
        progress.artifact_game_score = score
    db.session.commit()

    xp_earned = 0
    if first_time or score > 0:
        xp_earned = 30
        award_xp(user_id, xp_earned, f"Completed Artifact Match: {topic.name}")

    unlocked_achievements = check_and_award_achievements(user_id)

    return jsonify({
        'success': True,
        'message': 'Artifact match game completed successfully',
        'data': {
            'score': score,
            'xp_earned': xp_earned,
            'unlocked_achievements': unlocked_achievements,
            'progress': progress.to_dict()
        }
    }), 200


@games_bp.route('/memory/<topic_id>', methods=['GET'])
def get_memory_game(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    items = GameItem.query.filter_by(topic_id=topic_id, game_type='memory').all()
    return jsonify({
        'success': True,
        'count': len(items),
        'data': [item.to_dict() for item in items]
    }), 200


@games_bp.route('/memory/<topic_id>/submit', methods=['POST'])
@jwt_required()
def submit_memory_game(topic_id):
    user_id = int(get_jwt_identity())
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    data = request.get_json() or {}
    score = data.get('score', 100)

    progress = get_or_create_progress(user_id, topic_id)
    first_time = (progress.memory_game_score == 0)

    if score > progress.memory_game_score:
        progress.memory_game_score = score
    db.session.commit()

    xp_earned = 0
    if first_time or score > 0:
        xp_earned = 30
        award_xp(user_id, xp_earned, f"Completed Memory Game: {topic.name}")

    unlocked_achievements = check_and_award_achievements(user_id)

    return jsonify({
        'success': True,
        'message': 'Memory game completed successfully',
        'data': {
            'score': score,
            'xp_earned': xp_earned,
            'unlocked_achievements': unlocked_achievements,
            'progress': progress.to_dict()
        }
    }), 200
