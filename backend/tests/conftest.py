import os


if os.getenv("TESTING") == "1":
    os.environ["DATABASE_URL"] = "postgresql+psycopg2://postgres:postgres@localhost:5432/finance_test"

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base
from app import models
from app.core.security import get_db

# Now safe to use
TEST_DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c