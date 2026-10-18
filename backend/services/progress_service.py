from datetime import datetime
from extensions import db
from models.progress import UserProgress

def get_or_create_progress(user_id, topic_id):
    """
    Returns existing UserProgress or creates a new record for user & topic.
    """
    progress = UserProgress.query.filter_by(user_id=user_id, topic_id=topic_id).first()
    if not progress:
        progress = UserProgress(
            user_id=user_id,
            topic_id=topic_id,
            story_completed=False,
            quiz_score=0,
            artifact_game_score=0,
            memory_game_score=0
        )
        db.session.add(progress)
        db.session.commit()
    return progress
