from flask import Blueprint, request, jsonify
from services.user_service import UserService
from services.token_service import TokenService
from models.user_model import UserCreate, UserUpdate, UserLogin
import uuid

router = Blueprint("users", __name__, url_prefix="/users")
user_service = UserService()
token_service = TokenService()


def validate_uuid(user_id: str) -> bool:
    try:
        uuid.UUID(user_id)
        return True
    except (ValueError, AttributeError):
        return False


@router.route("/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        user_data = UserCreate(**data)
        user_id = user_service.create_user(user_data)
        return jsonify({"message": "User created successfully", "user_id": user_id}), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/login", methods=["POST"])
def login_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        login_data = UserLogin(**data)
        user = user_service.login_user(login_data.username, login_data.password)

        if not user:
            return jsonify({"error": "Invalid username or password"}), 401

        try:
            access_token = token_service.create_access_token(user.user_id, user.username)
            refresh_token = token_service.create_refresh_token(user.user_id, user.username)
            
            if not access_token or not refresh_token:
                print(f"ERROR: Failed to generate tokens for user {user.user_id}")
                return jsonify({"error": "Failed to generate authentication tokens"}), 500
        except Exception as token_error:
            print(f"ERROR: Token generation failed: {str(token_error)}")
            return jsonify({"error": f"Token generation failed: {str(token_error)}"}), 500

        response_data = {
            "user": user.model_dump(),
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer"
        }
        
        print(f"Login successful for user {user.user_id}, tokens generated")
        return jsonify(response_data), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"ERROR: Login failed: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/refresh", methods=["POST"])
def refresh_token():
    try:
        data = request.get_json()
        if not data or "refresh_token" not in data:
            return jsonify({"error": "refresh_token is required"}), 400

        refresh_token = data["refresh_token"]
        new_access_token = token_service.refresh_access_token(refresh_token)

        if not new_access_token:
            return jsonify({"error": "Invalid or expired refresh token"}), 401

        return jsonify({
            "access_token": new_access_token,
            "token_type": "Bearer"
        }), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/<user_id>", methods=["GET"])
def get_user_by_id(user_id: str):
    try:
        if not validate_uuid(user_id):
            return jsonify({"error": "Invalid user ID format"}), 400

        user = user_service.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user.model_dump()), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/", methods=["GET"])
def get_all_users():
    try:
        skip = int(request.args.get("skip", 0))
        limit = int(request.args.get("limit", 100))

        users = user_service.get_all_users(skip=skip, limit=limit)
        return jsonify([user.model_dump() for user in users]), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/<user_id>", methods=["PUT"])
def update_user(user_id: str):
    try:
        if not validate_uuid(user_id):
            return jsonify({"error": "Invalid user ID format"}), 400

        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        user_data = UserUpdate(**data)
        result = user_service.update_user(user_id, user_data)
        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/<user_id>/status", methods=["PUT"])
def update_user_status(user_id: str):
    try:
        if not validate_uuid(user_id):
            return jsonify({"error": "Invalid user ID format"}), 400

        data = request.get_json()
        if not data or "is_active" not in data:
            return jsonify({"error": "is_active field is required"}), 400

        is_active = bool(data["is_active"])
        result = user_service.update_user_status(user_id, is_active)
        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/<user_id>", methods=["DELETE"])
def delete_user(user_id: str):
    try:
        if not validate_uuid(user_id):
            return jsonify({"error": "Invalid user ID format"}), 400

        result = user_service.delete_user(user_id)
        return jsonify(result), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@router.route("/", methods=["DELETE"])
def delete_all_users():
    try:
        result = user_service.delete_all_users()
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

