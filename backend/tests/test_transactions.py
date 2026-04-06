import uuid


def create_and_login(client):
    email = f"tx_{uuid.uuid4()}@test.com"

    client.post("/api/v1/users", json={
        "email": email,
        "password": "Password123!",
        "full_name": "Tx User",
        "phone": "123456",
        "company": "TestCorp"
    })

    login = client.post("/api/v1/login", json={
        "email": email,
        "password": "Password123!"
    })

    return login.json()["access_token"]


def test_create_transaction(client):
    token = create_and_login(client)

    response = client.post(
        "/api/v1/transactions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "amount": 5000,
            "currency": "USD",
            "country": "US",
            "tx_type": "debit",
            "merchant_category": "online",
            "device_used": "mobile",
            "payment_channel": "card"
        }
    )

    assert response.status_code == 200
    assert "fraud_risk" in response.json()


def test_transaction_validation(client):
    token = create_and_login(client)

    response = client.post(
        "/api/v1/transactions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "amount": 5000
        }
    )

    assert response.status_code == 422


def test_get_transactions(client):
    token = create_and_login(client)

    client.post(
        "/api/v1/transactions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "amount": 1000,
            "currency": "USD",
            "country": "US",
            "tx_type": "debit",
            "merchant_category": "online",
            "device_used": "mobile",
            "payment_channel": "card"
        }
    )

    response = client.get(
        "/api/v1/transactions",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert "data" in response.json()


def test_transaction_requires_auth(client):
    response = client.post("/api/v1/transactions", json={})

    assert response.status_code in [401, 403]