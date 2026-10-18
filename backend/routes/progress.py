from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from models.progress import UserProgress
from models.quiz import QuizResult
from models.achievement import UserAchievement
from models.activity import UserActivity

progress_bp = Blueprint('progress', __name__, url_prefix='/api')

@progress_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_user_all_progress():
    user_id = int(get_jwt_identity())
    records = UserProgress.query.filter_by(user_id=user_id).all()
    return jsonify({
        'success': True,
        'count': len(records),
        'data': [r.to_dict() for r in records]
    }), 200


@progress_bp.route('/progress/<topic_id>', methods=['GET'])
@jwt_required()
def get_user_topic_progress(topic_id):
    user_id = int(get_jwt_identity())
    progress = UserProgress.query.filter_by(user_id=user_id, topic_id=topic_id).first()
    if not progress:
        return jsonify({
            'success': True,
            'data': {
                'user_id': user_id,
                'topic_id': topic_id,
                'story_completed': False,
                'quiz_score': 0,
                'artifact_game_score': 0,
                'memory_game_score': 0,
                'completed_at': None
            }
        }), 200

    return jsonify({
        'success': True,
        'data': progress.to_dict()
    }), 200


@progress_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_user_dashboard():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    completed_progress_records = UserProgress.query.filter_by(user_id=user_id, story_completed=True).all()
    completed_stories_ids = [r.topic_id for r in completed_progress_records]
    stories_completed_count = len(completed_stories_ids)

    user_quiz_results = QuizResult.query.filter_by(user_id=user_id).all()
    quizzes_completed_count = len(user_quiz_results)
    quiz_results_dict = {}
    for qr in user_quiz_results:
        quiz_results_dict[qr.topic_id] = {
            'score': qr.score,
            'total': qr.total_questions,
            'percentage': qr.percentage,
            'date': qr.completed_at.isoformat() if qr.completed_at else None
        }

    artifact_games = UserProgress.query.filter(UserProgress.user_id == user_id, UserProgress.artifact_game_score > 0).count()
    memory_games = UserProgress.query.filter(UserProgress.user_id == user_id, UserProgress.memory_game_score > 0).count()
    games_completed = artifact_games + memory_games

    user_badges = UserAchievement.query.filter_by(user_id=user_id).all()
    unlocked_badge_ids = [b.achievement_id for b in user_badges]

    last_progress = UserProgress.query.filter_by(user_id=user_id).order_by(UserProgress.updated_at.desc()).first()
    last_active_topic_id = last_progress.topic_id if last_progress else None

    user_activities = UserActivity.query.filter_by(user_id=user_id).order_by(UserActivity.created_at.desc()).limit(10).all()
    activity_list = [a.to_dict() for a in user_activities]

    user_level = (user.xp // 100) + 1

    user_dict = user.to_dict()

    return jsonify({
        'success': True,
        'data': {
            'id': user.id,
            'user_id': user.id,
            'name': user.name,
            'role': user_dict['role'],
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'member_since': user_dict.get('member_since'),
            'joined': user_dict.get('joined'),
            'xp': user.xp,
            'level': user_level,
            'stories_completed': stories_completed_count,
            'completed_stories': completed_stories_ids,
            'quizzes_completed': quizzes_completed_count,
            'quiz_results': quiz_results_dict,
            'games_completed': games_completed,
            'game_stats': {
                'artifactMatchCompleted': artifact_games,
                'memoryGameCompleted': memory_games,
                'totalGamesPlayed': games_completed
            },
            'badges': len(unlocked_badge_ids),
            'unlocked_badges': unlocked_badge_ids,
            'badges_list': [b.to_dict() for b in user_badges],
            'last_active_topic_id': last_active_topic_id,
            'activities': activity_list
        }
    }), 200

