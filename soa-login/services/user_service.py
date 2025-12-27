import hashlib
import logging
import secrets
from datetime import datetime
from typing import Optional, List
from db.supabase import get_db
from models.user_model import UserCreate, UserUpdate, UserResponse
import requests
import os
from logging_utils import get_correlation_id, get_logger


class UserService:
    def __init__(self):
        self.logger = get_logger() or logging.getLogger("soa-login")
        self.db = get_db()
        self.expense_service_url = os.getenv("EXPENSE_SERVICE_URL", "http://localhost:8000")

    def _hash_password(self, password: str) -> str:
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"

    def _verify_password(self, password: str, hashed_password: str) -> bool:
        salt, password_hash = hashed_password.split(":")
        return hashlib.sha256((password + salt).encode()).hexdigest() == password_hash

    def create_user(self, user_data: UserCreate) -> str:
        existing_username = self.db.table("users").select("id").eq("username", user_data.username).execute()
        if existing_username.data:
            raise ValueError("Username already exists")

        existing_email = self.db.table("users").select("id").eq("email", user_data.email).execute()
        if existing_email.data:
            raise ValueError("Email already exists")

        hashed_password = self._hash_password(user_data.password)

        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "is_active": True,
        }

        result = self.db.table("users").insert(user_doc).execute()
        if not result.data:
            raise ValueError("Failed to create user")
        
        user_id = result.data[0]["id"]

        headers = {}
        cid = get_correlation_id()
        if cid:
            headers["X-Correlation-Id"] = cid
        try:
            requests.post(
                f"{self.expense_service_url}/users/{user_id}/initialize",
                json={"user_id": user_id, "username": user_data.username},
                headers=headers,
                timeout=2,
            )
        except requests.RequestException as exc:
            self.logger.warning(
                "Failed to initialize expense profile",
                extra={
                    "correlation_id": cid,
                    "url": f"{self.expense_service_url}/users/{user_id}/initialize",
                    "method": "POST",
                    "detail": str(exc),
                },
            )

        self.logger.info(
            "User created",
            extra={
                "correlation_id": get_correlation_id(),
                "path": "/users/register",
                "detail": f"user_id={user_id}",
            },
        )
        return str(user_id)

    def get_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        try:
            result = self.db.table("users").select("*").eq("id", user_id).execute()
            if not result.data:
                return None

            user_doc = result.data[0]
            created_at = user_doc["created_at"]
            updated_at = user_doc["updated_at"]
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            if isinstance(updated_at, str):
                updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
            
            return UserResponse(
                user_id=str(user_doc["id"]),
                username=user_doc["username"],
                email=user_doc["email"],
                first_name=user_doc.get("first_name"),
                last_name=user_doc.get("last_name"),
                created_at=created_at,
                updated_at=updated_at,
                is_active=user_doc.get("is_active", True),
            )
        except Exception:
            return None

    def get_user_by_username(self, username: str) -> Optional[UserResponse]:
        result = self.db.table("users").select("*").eq("username", username).execute()
        if not result.data:
            return None

        user_doc = result.data[0]
        created_at = user_doc["created_at"]
        updated_at = user_doc["updated_at"]
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        if isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        
        return UserResponse(
            user_id=str(user_doc["id"]),
            username=user_doc["username"],
            email=user_doc["email"],
            first_name=user_doc.get("first_name"),
            last_name=user_doc.get("last_name"),
            created_at=created_at,
            updated_at=updated_at,
            is_active=user_doc.get("is_active", True),
        )

    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[UserResponse]:
        result = self.db.table("users").select("*").range(skip, skip + limit - 1).execute()
        
        users = []
        for user_doc in result.data:
            created_at = user_doc["created_at"]
            updated_at = user_doc["updated_at"]
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            if isinstance(updated_at, str):
                updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
            
            users.append(
                UserResponse(
                    user_id=str(user_doc["id"]),
                    username=user_doc["username"],
                    email=user_doc["email"],
                    first_name=user_doc.get("first_name"),
                    last_name=user_doc.get("last_name"),
                    created_at=created_at,
                    updated_at=updated_at,
                    is_active=user_doc.get("is_active", True),
                )
            )
        return users

    def login_user(self, username: str, password: str) -> Optional[UserResponse]:
        result = self.db.table("users").select("*").eq("username", username).execute()
        if not result.data:
            return None

        user_doc = result.data[0]

        if not user_doc.get("is_active", True):
            raise ValueError("User account is inactive")

        if not self._verify_password(password, user_doc["password"]):
            return None

        created_at = user_doc["created_at"]
        updated_at = user_doc["updated_at"]
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        if isinstance(updated_at, str):
            updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))

        user = UserResponse(
            user_id=str(user_doc["id"]),
            username=user_doc["username"],
            email=user_doc["email"],
            first_name=user_doc.get("first_name"),
            last_name=user_doc.get("last_name"),
            created_at=created_at,
            updated_at=updated_at,
            is_active=user_doc.get("is_active", True),
        )
        self.logger.info(
            "User login success",
            extra={
                "correlation_id": get_correlation_id(),
                "path": "/users/login",
                "detail": f"user_id={user.user_id}",
            },
        )
        return user

    def update_user(self, user_id: str, user_data: UserUpdate) -> dict:
        try:
            existing = self.db.table("users").select("id").eq("id", user_id).execute()
            if not existing.data:
                raise ValueError(f"User with id {user_id} not found")

            update_data = {"updated_at": datetime.now().isoformat()}

            if user_data.username is not None:
                username_check = self.db.table("users").select("id").eq("username", user_data.username).execute()
                if username_check.data and str(username_check.data[0]["id"]) != user_id:
                    raise ValueError("Username already exists")
                update_data["username"] = user_data.username

            if user_data.email is not None:
                email_check = self.db.table("users").select("id").eq("email", user_data.email).execute()
                if email_check.data and str(email_check.data[0]["id"]) != user_id:
                    raise ValueError("Email already exists")
                update_data["email"] = user_data.email

            if user_data.first_name is not None:
                update_data["first_name"] = user_data.first_name

            if user_data.last_name is not None:
                update_data["last_name"] = user_data.last_name

            if user_data.password is not None:
                update_data["password"] = self._hash_password(user_data.password)

            self.db.table("users").update(update_data).eq("id", user_id).execute()
            self.logger.info(
                "User updated",
                extra={
                    "correlation_id": get_correlation_id(),
                    "path": f"/users/{user_id}",
                    "detail": ",".join(update_data.keys()),
                },
            )
            return {"message": "User updated successfully"}

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"Error updating user: {str(e)}")

    def update_user_status(self, user_id: str, is_active: bool) -> dict:
        try:
            existing = self.db.table("users").select("id").eq("id", user_id).execute()
            if not existing.data:
                raise ValueError(f"User with id {user_id} not found")

            self.db.table("users").update({
                "is_active": is_active,
                "updated_at": datetime.now().isoformat()
            }).eq("id", user_id).execute()
            self.logger.info(
                "User status updated",
                extra={
                    "correlation_id": get_correlation_id(),
                    "path": f"/users/{user_id}/status",
                    "detail": f"is_active={is_active}",
                },
            )
            
            return {"message": f"User status updated to {'active' if is_active else 'inactive'}"}

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"Error updating user status: {str(e)}")

    def delete_user(self, user_id: str) -> dict:
        try:
            existing = self.db.table("users").select("id").eq("id", user_id).execute()
            if not existing.data:
                raise ValueError(f"User with id {user_id} not found")

            self.db.table("users").delete().eq("id", user_id).execute()

            headers = {}
            cid = get_correlation_id()
            if cid:
                headers["X-Correlation-Id"] = cid
            try:
                requests.delete(
                    f"{self.expense_service_url}/users/{user_id}/expenses/expense/delete-all",
                    headers=headers,
                    timeout=2,
                )
            except requests.RequestException as exc:
                self.logger.warning(
                    "Failed to cleanup expenses on user delete",
                    extra={
                        "correlation_id": cid,
                        "url": f"{self.expense_service_url}/users/{user_id}/expenses/expense/delete-all",
                        "method": "DELETE",
                        "detail": str(exc),
                    },
                )

            self.logger.info(
                "User deleted",
                extra={
                    "correlation_id": get_correlation_id(),
                    "path": f"/users/{user_id}",
                    "detail": "deleted",
                },
            )

            return {"message": "User deleted successfully"}

        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"Error deleting user: {str(e)}")

    def delete_all_users(self) -> dict:
        all_users = self.db.table("users").select("id").execute()
        count = len(all_users.data) if all_users.data else 0
        
        if count > 0:
            for user in all_users.data:
                self.db.table("users").delete().eq("id", user["id"]).execute()
        self.logger.info(
            "All users deleted",
            extra={
                "correlation_id": get_correlation_id(),
                "path": "/users",
                "detail": f"count={count}",
            },
        )
        
        return {"message": f"Deleted {count} users successfully"}
