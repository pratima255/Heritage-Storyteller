from datetime import datetime, timezone
from extensions import db
from models.user import User
from models.progress import UserProgress
from models.quiz import QuizResult
from models.achievement import Achievement, UserAchievement

def check_and_award_achievements(user_id):
    """
    Checks user statistics and awards achievements if requirements are met.
    Returns list of newly unlocked achievement dictionaries.
    """
    user = db.session.get(User, user_id)
    if not user:
        return []

    # Get user's current achievements
    existing = set(ua.achievement_id for ua in UserAchievement.query.filter_by(user_id=user_id).all())

    # Get stats
    stories_completed_count = UserProgress.query.filter_by(user_id=user_id, story_completed=True).count()
    perfect_quizzes_count = QuizResult.query.filter(
        QuizResult.user_id == user_id,
        QuizResult.score == QuizResult.total_questions
    ).count()

    artifact_games_count = UserProgress.query.filter(UserProgress.user_id == user_id, UserProgress.artifact_game_score > 0).count()
    memory_games_count = UserProgress.query.filter(UserProgress.user_id == user_id, UserProgress.memory_game_score > 0).count()
    
    both_games_played = 1 if (artifact_games_count > 0 and memory_games_count > 0) else 0
    total_games_completed = artifact_games_count + memory_games_count

    all_achievements = Achievement.query.all()
    unlocked_new = []

    for ach in all_achievements:
        if ach.id in existing:
            continue

        unlocked = False
        if ach.requirement_type == 'stories_completed' and stories_completed_count >= ach.requirement_value:
            unlocked = True
        elif ach.requirement_type == 'perfect_quizzes' and perfect_quizzes_count >= ach.requirement_value:
            unlocked = True
        elif ach.requirement_type == 'games_completed':
            if ach.id == 'heritage_gamer':
                if both_games_played > 0 or total_games_completed >= ach.requirement_value:
                    unlocked = True
            elif total_games_completed >= ach.requirement_value:
                unlocked = True

        if unlocked:
            new_ua = UserAchievement(
                user_id=user_id,
                achievement_id=ach.id,
                earned_at=datetime.now(timezone.utc)
            )
            db.session.add(new_ua)
            
            # Log activity for earned badge
            from models.activity import UserActivity
            act = UserActivity(
                user_id=user_id,
                title=f"Earned Badge: {ach.name}",
                xp=50
            )
            db.session.add(act)

            unlocked_new.append(ach.to_dict())

    if unlocked_new:
        db.session.commit()


    return unlocked_new
