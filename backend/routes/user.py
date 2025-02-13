import bcrypt

from jose import jwt
import ujson
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Response

from logger import logger
from api_interface import UserCreationResponse
from database.crud import create_user_in_db, find_user_by_email
from config import FOLDER_STRUCTURE, JWT_SECRET
from models import CreateUserInput

router = APIRouter(prefix='/user')

def hash_password(password: str) -> str:
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')


def verify_password(entered_password: str, stored_hashed_password: str) -> bool:
    # Check if the entered password matches the stored hashed password
    return bcrypt.checkpw(entered_password.encode('utf-8'), stored_hashed_password.encode('utf-8'))


def create_token(user_id: str) -> str:
    token_payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=30),
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm="HS256")
    return token


@router.post("/create")
def create_user(input_data: CreateUserInput) -> UserCreationResponse:
    try:
        email = input_data.email
        password = input_data.password
        hashed_password = hash_password(password)
        response = create_user_in_db(email, hashed_password)
        if response["status"] == "failed":
            raise Exception(response["message"])
        else:
            user_id = response["message"]
        # create_user_folders(user_id)
        logger.info(f"Successfully added new user with id: {user_id}")
        res = UserCreationResponse(status="success", user_id=user_id)

    except Exception as e:
        msg = f"Failed to add new user, error: {e}"
        logger.error(msg)
        return UserCreationResponse(status="failed", user_id="User already exists")

    else:
        return res


@router.post("/authenticate")
def authenticate(input_data: CreateUserInput) -> Response:
    try:
        user = find_user_by_email(input_data.email)
        verified = verify_password(input_data.password, user.password)
        if user is None:
            raise HTTPException(status_code=401, detail="Failed to authenticate user, no user found with that email")
        if not verified:
            raise HTTPException(status_code=401, detail="Failed to authenticate user, password is incorrect")
        access_token = create_token(str(user.id))
        print("Successful authentication: ", access_token)
        response = Response(
            content=ujson.dumps({"access_token": access_token, "token_type": "bearer"})
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Failed to authenticate user, error: {e}")
    return response