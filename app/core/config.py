from dotenv import load_dotenv
import os

load_dotenv()

MAX_REQUESTS = int(os.getenv("MAX_REQUESTS", 100))
GLOBAL_WINDOW = int(os.getenv("GLOBAL_WINDOW", 60))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")