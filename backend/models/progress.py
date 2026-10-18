from datetime import datetime
from extensions import db

class UserProgress(db.Model):
    __tablename__ = 'user_progress'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('heritage_topics.id', ondelete='CASCADE'), nullable=False, index=True)
    story_completed = db.Column(db.Boolean, default=False, nullable=False)
    quiz_score = db.Column(db.Integer, default=0, nullable=False)
    artifact_game_score = db.Column(db.Integer, default=0, nullable=False)
    memory_game_score = db.Column(db.Integer, default=0, nullable=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'topic_id', name='uq_user_topic_progress'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'topic_id': self.topic_id,
            'story_completed': self.story_completed,
            'quiz_score': self.quiz_score,
            'artifact_game_score': self.artifact_game_score,
            'memory_game_score': self.memory_game_score,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
