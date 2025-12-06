import jwt
import os
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional

class TokenService:
    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
        self.access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
        self.refresh_token_expire_days = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
        self.algorithm = "HS256"

    def create_access_token(self, user_id: str, username: str) -> str:
        now = datetime.now(timezone.utc)
        exp = now + timedelta(minutes=self.access_token_expire_minutes)
        payload = {
            "sub": user_id,
            "username": username,
            "type": "access",
            "exp": int(exp.timestamp()),
            "iat": int(now.timestamp())
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, user_id: str, username: str) -> str:
        now = datetime.now(timezone.utc)
        exp = now + timedelta(days=self.refresh_token_expire_days)
        payload = {
            "sub": user_id,
            "username": username,
            "type": "refresh",
            "exp": int(exp.timestamp()),
            "iat": int(now.timestamp())
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    def verify_token(self, token: str, token_type: str = "access") -> Optional[Dict]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            if payload.get("type") != token_type:
                return None
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def refresh_access_token(self, refresh_token: str) -> Optional[str]:
        payload = self.verify_token(refresh_token, "refresh")
        if not payload:
            return None
        
        user_id = payload.get("sub")
        username = payload.get("username")
        if not user_id or not username:
            return None
        
        return self.create_access_token(user_id, username)

