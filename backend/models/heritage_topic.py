from datetime import datetime
from extensions import db

STATE_REGION_MAP = {
    'maharashtra': 'West India',
    'tamil nadu': 'South India',
    'assam': 'East India',
    'jammu & kashmir': 'North India',
    'jammu and kashmir': 'North India',
    'madhya pradesh': 'Central India'
}

class HeritageTopic(db.Model):
    __tablename__ = 'heritage_topics'

    id = db.Column(db.String(100), primary_key=True)  # e.g., 'warli-art'
    name = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False, index=True)
    state = db.Column(db.String(50), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    historical_background = db.Column(db.Text, nullable=True)
    cover_image = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='Active', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapters = db.relationship('StoryChapter', backref='topic', cascade='all, delete-orphan', lazy=True, order_by='StoryChapter.chapter_number')
    quiz_questions = db.relationship('QuizQuestion', backref='topic', cascade='all, delete-orphan', lazy=True)
    game_items = db.relationship('GameItem', backref='topic', cascade='all, delete-orphan', lazy=True)
    progress_records = db.relationship('UserProgress', backref='topic', cascade='all, delete-orphan', lazy=True)
    quiz_results = db.relationship('QuizResult', backref='topic', cascade='all, delete-orphan', lazy=True)

    @property
    def region(self):
        if not self.state:
            return None
        return STATE_REGION_MAP.get(self.state.strip().lower())

    def to_dict(self, include_details=False):
        data = {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'state': self.state,
            'region': self.region,
            'description': self.description,
            'historical_background': self.historical_background,
            'cover_image': self.cover_image,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'chapters_count': len(self.chapters) if self.chapters else 0,
            'quiz_questions_count': len(self.quiz_questions) if self.quiz_questions else 0
        }
        if include_details:
            data['chapters'] = [c.to_dict() for c in self.chapters]
            data['quiz_questions'] = [q.to_dict(include_answer=False) for q in self.quiz_questions]
            data['game_items'] = [g.to_dict() for g in self.game_items]
        return data
