import uuid


def create_user(client):
    email = f"auth_{uuid.uuid4()}@test.com"

    client.post("/api/v1/users", json={
        "email": email,
        "password": "Password123!",
        "full_name": "Test User",
        "phone": "123456",
        "company": "TestCorp"
    })

    return email


def test_login_success(client):
    email = create_user(client)

    response = client.post("/api/v1/login", json={
        "email": email,
        "password": "Password123!"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    email = create_user(client)

    response = client.post("/api/v1/login", json={
        "email": email,
        "password": "WrongPassword"
    })

    assert response.status_code == 401


def test_account_lockout(client):
    email = create_user(client)

    for _ in range(5):
        client.post("/api/v1/login", json={
            "email": email,
            "password": "WrongPassword"
        })

    response = client.post("/api/v1/login", json={
        "email": email,
        "password": "WrongPassword"
    })

    assert response.status_code in [401, 403]


def test_refresh_token(client):
    email = create_user(client)

    login = client.post("/api/v1/login", json={
        "email": email,
        "password": "Password123!"
    })

    cookies = login.cookies

    response = client.post("/api/v1/refresh", cookies=cookies)

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_logout(client):
    email = create_user(client)

    login = client.post("/api/v1/login", json={
        "email": email,
        "password": "Password123!"
    })

    cookies = login.cookies

    response = client.post("/api/v1/logout", cookies=cookies)

    assert response.status_code == 200