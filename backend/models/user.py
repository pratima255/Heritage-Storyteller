from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='Student', nullable=False)  # 'Student' or 'Admin'
    xp = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    progress_records = db.relationship('UserProgress', backref='user', cascade='all, delete-orphan', lazy=True)
    quiz_results = db.relationship('QuizResult', backref='user', cascade='all, delete-orphan', lazy=True)
    user_achievements = db.relationship('UserAchievement', backref='user', cascade='all, delete-orphan', lazy=True)
    activities = db.relationship('UserActivity', backref='user', cascade='all, delete-orphan', lazy=True)

    @property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, raw_password):
        self.set_password(raw_password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        role_display = 'Admin' if self.role and self.role.lower() == 'admin' else 'Student'
        formatted_date = self.created_at.strftime('%d %b %Y') if self.created_at else 'Oct 2026'
        return {
            'id': self.id,
            'user_id': self.id,
            'name': self.name,
            'role': role_display,
            'xp': self.xp,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'member_since': formatted_date,
            'joined': formatted_date
        }


