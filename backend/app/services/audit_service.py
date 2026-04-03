from app import models


def log_action(db, action: str, user_email: str):
    entry = models.AuditLog(
        action=action,
        user_email=user_email
    )
    db.add(entry)
    db.commit()
