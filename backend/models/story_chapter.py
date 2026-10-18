from datetime import datetime
from extensions import db

class StoryChapter(db.Model):
    __tablename__ = 'story_chapters'

    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('heritage_topics.id', ondelete='CASCADE'), nullable=False, index=True)
    chapter_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text, nullable=True)
    audio_url = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'topic_id': self.topic_id,
            'chapter_number': self.chapter_number,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'audio_url': self.audio_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
