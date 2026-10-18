from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone
from extensions import db
from models.heritage_topic import HeritageTopic
from models.quiz import QuizQuestion, QuizResult
from services.xp_service import award_xp
from services.progress_service import get_or_create_progress
from services.achievement_service import check_and_award_achievements

quizzes_bp = Blueprint('quizzes', __name__, url_prefix='/api/topics')

@quizzes_bp.route('/<topic_id>/quiz', methods=['GET'])
def get_quiz(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    questions = QuizQuestion.query.filter_by(topic_id=topic_id).all()
    data = [q.to_dict(include_answer=False) for q in questions]

    return jsonify({
        'success': True,
        'count': len(data),
        'data': data
    }), 200


@quizzes_bp.route('/<topic_id>/quiz/submit', methods=['POST'])
@jwt_required()
def submit_quiz(topic_id):
    user_id = int(get_jwt_identity())
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    questions = QuizQuestion.query.filter_by(topic_id=topic_id).all()
    if not questions:
        return jsonify({'success': False, 'message': 'No quiz questions found for this topic'}), 404

    data = request.get_json() or {}
    user_answers = data.get('answers', {})

    score = 0
    total = len(questions)
    details = []

    q_map = {q.id: q for q in questions}

    if isinstance(user_answers, dict):
        for q_id_str, submitted in user_answers.items():
            try:
                q_id = int(q_id_str)
            except ValueError:
                continue

            if q_id in q_map:
                q = q_map[q_id]
                correct = q.correct_answer.strip().lower()
                sub_clean = str(submitted).strip().lower()

                is_correct = False
                if sub_clean == correct:
                    is_correct = True
                elif sub_clean.startswith('a') and correct.startswith('a'):
                    is_correct = True
                elif sub_clean.startswith('b') and correct.startswith('b'):
                    is_correct = True
                elif sub_clean.startswith('c') and correct.startswith('c'):
                    is_correct = True
                elif sub_clean.startswith('d') and correct.startswith('d'):
                    is_correct = True

                if is_correct:
                    score += 1

                details.append({
                    'question_id': q.id,
                    'is_correct': is_correct,
                    'correct_answer': q.correct_answer,
                    'explanation': q.explanation
                })

    elif isinstance(user_answers, list):
        for item in user_answers:
            q_id = item.get('question_id')
            submitted = item.get('answer', '')
            if q_id in q_map:
                q = q_map[q_id]
                correct = q.correct_answer.strip().lower()
                sub_clean = str(submitted).strip().lower()

                is_correct = (sub_clean == correct or sub_clean in correct or correct in sub_clean)
                if is_correct:
                    score += 1

                details.append({
                    'question_id': q.id,
                    'is_correct': is_correct,
                    'correct_answer': q.correct_answer,
                    'explanation': q.explanation
                })

    percentage = round((score / total) * 100, 2) if total > 0 else 0.0

    quiz_result = QuizResult(
        user_id=user_id,
        topic_id=topic_id,
        score=score,
        total_questions=total,
        percentage=percentage,
        completed_at=datetime.now(timezone.utc)
    )
    db.session.add(quiz_result)

    progress = get_or_create_progress(user_id, topic_id)
    first_time_quiz = (progress.quiz_score == 0)
    if score > progress.quiz_score:
        progress.quiz_score = score
    db.session.commit()

    xp_earned = 0
    if first_time_quiz or score > 0:
        base_xp = 30
        bonus_xp = 20 if percentage == 100.0 else 0
        xp_earned = base_xp + bonus_xp
        award_xp(user_id, xp_earned, f"Quiz completed: {topic.name}")

    unlocked_achievements = check_and_award_achievements(user_id)

    return jsonify({
        'success': True,
        'message': 'Quiz submitted successfully',
        'data': {
            'score': score,
            'total_questions': total,
            'percentage': percentage,
            'xp_earned': xp_earned,
            'unlocked_achievements': unlocked_achievements,
            'details': details
        }
    }), 200
