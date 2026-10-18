from datetime import datetime
from extensions import db

class QuizQuestion(db.Model):
    __tablename__ = 'quiz_questions'

    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('heritage_topics.id', ondelete='CASCADE'), nullable=False, index=True)
    question = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(255), nullable=False)
    option_b = db.Column(db.String(255), nullable=False)
    option_c = db.Column(db.String(255), nullable=False)
    option_d = db.Column(db.String(255), nullable=False)
    correct_answer = db.Column(db.String(255), nullable=False)
    explanation = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self, include_answer=False):
        data = {
            'id': self.id,
            'topic_id': self.topic_id,
            'question': self.question,
            'option_a': self.option_a,
            'option_b': self.option_b,
            'option_c': self.option_c,
            'option_d': self.option_d,
            'options': [self.option_a, self.option_b, self.option_c, self.option_d],
            'explanation': self.explanation,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_answer:
            data['correct_answer'] = self.correct_answer
        return data


class QuizResult(db.Model):
    __tablename__ = 'quiz_results'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('heritage_topics.id', ondelete='CASCADE'), nullable=False, index=True)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    percentage = db.Column(db.Float, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'topic_id': self.topic_id,
            'score': self.score,
            'total_questions': self.total_questions,
            'percentage': self.percentage,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
