from datetime import datetime
from extensions import db

class GameItem(db.Model):
    __tablename__ = 'game_items'

    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('heritage_topics.id', ondelete='CASCADE'), nullable=False, index=True)
    game_type = db.Column(db.String(50), nullable=False, index=True)  # 'artifact_match' or 'memory'
    item_name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.Text, nullable=True)
    match_value = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'topic_id': self.topic_id,
            'game_type': self.game_type,
            'item_name': self.item_name,
            'image_url': self.image_url,
            'match_value': self.match_value
        }
