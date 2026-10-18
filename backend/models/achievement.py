from datetime import datetime
from extensions import db

class Achievement(db.Model):
    __tablename__ = 'achievements'

    id = db.Column(db.String(50), primary_key=True)  # e.g., 'heritage_explorer'
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    badge_image = db.Column(db.Text, nullable=True)
    requirement_type = db.Column(db.String(50), nullable=False)  # 'stories_completed', 'perfect_quizzes', 'games_completed'
    requirement_value = db.Column(db.Integer, nullable=False)

    user_achievements = db.relationship('UserAchievement', backref='achievement', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'badge_image': self.badge_image,
            'requirement_type': self.requirement_type,
            'requirement_value': self.requirement_value
        }


class UserAchievement(db.Model):
    __tablename__ = 'user_achievements'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    achievement_id = db.Column(db.String(50), db.ForeignKey('achievements.id', ondelete='CASCADE'), nullable=False, index=True)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'achievement_id', name='uq_user_achievement'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'achievement_id': self.achievement_id,
            'achievement_name': self.achievement.name if self.achievement else None,
            'description': self.achievement.description if self.achievement else None,
            'badge_image': self.achievement.badge_image if self.achievement else None,
            'earned_at': self.earned_at.isoformat() if self.earned_at else None
        }
