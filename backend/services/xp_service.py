from extensions import db
from models.user import User
from models.activity import UserActivity

def award_xp(user_id, amount, reason="Activity Completion"):
    """
    Centralized function to award XP to a user and log activity.
    """
    user = db.session.get(User, user_id)
    if not user:
        return 0, False

    user.xp = (user.xp or 0) + amount

    activity = UserActivity(
        user_id=user_id,
        title=reason,
        xp=amount
    )
    db.session.add(activity)

    db.session.commit()
    return user.xp, True

