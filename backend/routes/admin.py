from flask import Blueprint, request, jsonify
from sqlalchemy import func
from extensions import db
from models.user import User
from models.heritage_topic import HeritageTopic
from models.story_chapter import StoryChapter
from models.quiz import QuizQuestion, QuizResult
from models.game import GameItem
from models.progress import UserProgress
from utils.auth_utils import admin_required

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_admin_dashboard():
    total_users = User.query.count()
    total_topics = HeritageTopic.query.count()

    total_stories_completed = UserProgress.query.filter_by(story_completed=True).count()
    total_quizzes_completed = QuizResult.query.count()

    artifact_count = UserProgress.query.filter(UserProgress.artifact_game_score > 0).count()
    memory_count = UserProgress.query.filter(UserProgress.memory_game_score > 0).count()
    total_games_played = artifact_count + memory_count

    popular_topics_query = db.session.query(
        HeritageTopic.id,
        HeritageTopic.name,
        HeritageTopic.category,
        HeritageTopic.state,
        func.count(UserProgress.id).label('progress_count')
    ).join(UserProgress, HeritageTopic.id == UserProgress.topic_id)\
     .group_by(HeritageTopic.id, HeritageTopic.name, HeritageTopic.category, HeritageTopic.state)\
     .order_by(func.count(UserProgress.id).desc())\
     .limit(5).all()

    popular_topics = [
        {
            'topic_id': pt[0],
            'name': pt[1],
            'category': pt[2],
            'state': pt[3],
            'user_count': pt[4]
        } for pt in popular_topics_query
    ]

    return jsonify({
        'success': True,
        'data': {
            'total_users': total_users,
            'total_heritage_topics': total_topics,
            'total_stories_completed': total_stories_completed,
            'total_quizzes_completed': total_quizzes_completed,
            'total_games_played': total_games_played,
            'most_popular_topics': popular_topics
        }
    }), 200


@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_all_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify({
        'success': True,
        'count': len(users),
        'data': [u.to_dict() for u in users]
    }), 200


@admin_bp.route('/progress', methods=['GET'])
@admin_required()
def get_all_progress():
    records = UserProgress.query.all()
    return jsonify({
        'success': True,
        'count': len(records),
        'data': [r.to_dict() for r in records]
    }), 200


# Quiz Management Endpoints
@admin_bp.route('/topics/<topic_id>/quiz', methods=['POST'])
@admin_required()
def create_quiz_question(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    data = request.get_json() or {}
    question = data.get('question')
    option_a = data.get('option_a')
    option_b = data.get('option_b')
    option_c = data.get('option_c')
    option_d = data.get('option_d')
    correct_answer = data.get('correct_answer')

    if not question or not option_a or not option_b or not option_c or not option_d or not correct_answer:
        return jsonify({'success': False, 'message': 'All question fields and correct_answer are required'}), 400

    q = QuizQuestion(
        topic_id=topic_id,
        question=question,
        option_a=option_a,
        option_b=option_b,
        option_c=option_c,
        option_d=option_d,
        correct_answer=correct_answer,
        explanation=data.get('explanation', '')
    )
    db.session.add(q)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Quiz question added',
        'data': q.to_dict(include_answer=True)
    }), 201


@admin_bp.route('/quiz-questions/<int:question_id>', methods=['PUT'])
@admin_required()
def update_quiz_question(question_id):
    q = db.session.get(QuizQuestion, question_id)
    if not q:
        return jsonify({'success': False, 'message': 'Question not found'}), 404

    data = request.get_json() or {}
    if 'question' in data:
        q.question = data['question']
    if 'option_a' in data:
        q.option_a = data['option_a']
    if 'option_b' in data:
        q.option_b = data['option_b']
    if 'option_c' in data:
        q.option_c = data['option_c']
    if 'option_d' in data:
        q.option_d = data['option_d']
    if 'correct_answer' in data:
        q.correct_answer = data['correct_answer']
    if 'explanation' in data:
        q.explanation = data['explanation']

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Quiz question updated',
        'data': q.to_dict(include_answer=True)
    }), 200


@admin_bp.route('/quiz-questions/<int:question_id>', methods=['DELETE'])
@admin_required()
def delete_quiz_question(question_id):
    q = db.session.get(QuizQuestion, question_id)
    if not q:
        return jsonify({'success': False, 'message': 'Question not found'}), 404

    db.session.delete(q)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Quiz question deleted'
    }), 200


# Game Items Management Endpoints
@admin_bp.route('/topics/<topic_id>/game-items', methods=['POST'])
@admin_required()
def create_game_item(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    data = request.get_json() or {}
    game_type = data.get('game_type')
    item_name = data.get('item_name')
    match_value = data.get('match_value')

    if not game_type or not item_name or not match_value:
        return jsonify({'success': False, 'message': 'game_type, item_name and match_value are required'}), 400

    item = GameItem(
        topic_id=topic_id,
        game_type=game_type,
        item_name=item_name,
        image_url=data.get('image_url', ''),
        match_value=match_value
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Game item added',
        'data': item.to_dict()
    }), 201


@admin_bp.route('/game-items/<int:item_id>', methods=['DELETE'])
@admin_required()
def delete_game_item(item_id):
    item = db.session.get(GameItem, item_id)
    if not item:
        return jsonify({'success': False, 'message': 'Game item not found'}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Game item deleted'
    }), 200
