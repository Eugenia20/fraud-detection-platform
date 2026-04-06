import uuid
from app.database import SessionLocal
from app import models


def create_admin(client):
    email = f"admin_{uuid.uuid4()}@test.com"

    client.post("/api/v1/users", json={
        "email": email,
        "password": "Password123!",
        "full_name": "Admin",
        "phone": "123456",
        "company": "AdminCorp"
    })

    # 🔥 Promote to admin
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == email).first()
    user.is_admin = True
    db.commit()
    db.close()

    login = client.post("/api/v1/login", json={
        "email": email,
        "password": "Password123!"
    })

    return login.json()["access_token"]


def test_admin_stats(client):
    token = create_admin(client)

    response = client.get(
        "/api/v1/admin/stats",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200


def test_admin_users(client):
    token = create_admin(client)

    response = client.get(
        "/api/v1/admin/users",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200


def test_admin_transactions(client):
    token = create_admin(client)

    response = client.get(
        "/api/v1/admin/transactions",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200


def test_admin_risky_users(client):
    token = create_admin(client)

    response = client.get(
        "/api/v1/admin/risky-users",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200