import time

FAILED_LOGINS = {}

def check_rate_limit(email: str):
    now = time.time()
    attempts = FAILED_LOGINS.get(email, [])

    attempts = [t for t in attempts if now - t < 60]

    if len(attempts) >= 5:
        return False

    FAILED_LOGINS[email] = attempts
    return True

def record_failed_login(email: str):
    FAILED_LOGINS.setdefault(email, []).append(time.time())
