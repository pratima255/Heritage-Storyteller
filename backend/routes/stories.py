from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone
from extensions import db
from models.heritage_topic import HeritageTopic
from models.story_chapter import StoryChapter
from services.xp_service import award_xp
from services.progress_service import get_or_create_progress
from services.achievement_service import check_and_award_achievements
from utils.auth_utils import admin_required

stories_bp = Blueprint('stories', __name__, url_prefix='/api')

@stories_bp.route('/topics/<topic_id>/chapters', methods=['GET'])
def get_chapters_by_topic(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    chapters = StoryChapter.query.filter_by(topic_id=topic_id).order_by(StoryChapter.chapter_number.asc()).all()
    return jsonify({
        'success': True,
        'count': len(chapters),
        'data': [c.to_dict() for c in chapters]
    }), 200


@stories_bp.route('/chapters/<int:chapter_id>', methods=['GET'])
def get_chapter(chapter_id):
    chapter = db.session.get(StoryChapter, chapter_id)
    if not chapter:
        return jsonify({'success': False, 'message': 'Chapter not found'}), 404

    return jsonify({
        'success': True,
        'data': chapter.to_dict()
    }), 200


@stories_bp.route('/topics/<topic_id>/chapters', methods=['POST'])
@admin_required()
def create_chapter(topic_id):
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    data = request.get_json() or {}
    chapter_number = data.get('chapter_number')
    title = data.get('title')
    content = data.get('content')

    if not chapter_number or not title or not content:
        return jsonify({'success': False, 'message': 'chapter_number, title and content are required'}), 400

    chapter = StoryChapter(
        topic_id=topic_id,
        chapter_number=chapter_number,
        title=title,
        content=content,
        image_url=data.get('image_url'),
        audio_url=data.get('audio_url')
    )

    db.session.add(chapter)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Chapter created successfully',
        'data': chapter.to_dict()
    }), 201


@stories_bp.route('/chapters/<int:chapter_id>', methods=['PUT'])
@admin_required()
def update_chapter(chapter_id):
    chapter = db.session.get(StoryChapter, chapter_id)
    if not chapter:
        return jsonify({'success': False, 'message': 'Chapter not found'}), 404

    data = request.get_json() or {}
    if 'chapter_number' in data:
        chapter.chapter_number = data['chapter_number']
    if 'title' in data:
        chapter.title = data['title']
    if 'content' in data:
        chapter.content = data['content']
    if 'image_url' in data:
        chapter.image_url = data['image_url']
    if 'audio_url' in data:
        chapter.audio_url = data['audio_url']

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Chapter updated successfully',
        'data': chapter.to_dict()
    }), 200


@stories_bp.route('/chapters/<int:chapter_id>', methods=['DELETE'])
@admin_required()
def delete_chapter(chapter_id):
    chapter = db.session.get(StoryChapter, chapter_id)
    if not chapter:
        return jsonify({'success': False, 'message': 'Chapter not found'}), 404

    db.session.delete(chapter)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Chapter deleted successfully'
    }), 200


@stories_bp.route('/topics/<topic_id>/complete-story', methods=['POST'])
@jwt_required()
def complete_story(topic_id):
    user_id = int(get_jwt_identity())
    topic = db.session.get(HeritageTopic, topic_id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    progress = get_or_create_progress(user_id, topic_id)
    
    xp_awarded = 0
    if not progress.story_completed:
        progress.story_completed = True
        progress.completed_at = datetime.now(timezone.utc)
        db.session.commit()
        
        award_xp(user_id, 20, f"Completed story: {topic.name}")
        xp_awarded = 20

    unlocked_achievements = check_and_award_achievements(user_id)

    return jsonify({
        'success': True,
        'message': 'Story completed successfully',
        'data': {
            'story_completed': True,
            'xp_earned': xp_awarded,
            'unlocked_achievements': unlocked_achievements,
            'progress': progress.to_dict()
        }
    }), 200
