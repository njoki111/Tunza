"""
Auth Routes
POST /api/auth/register  — family or caregiver signup
POST /api/auth/login     — login (role detected automatically)
POST /api/auth/refresh   — get new access token
POST /api/auth/logout    — revoke refresh token
GET  /api/auth/me        — get current user profile
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
import bcrypt

from app.extensions import db
from app.models import User, Caregiver

auth_bp = Blueprint("auth", __name__)

# Simple in-memory token blocklist (use Redis in production)
BLOCKLIST = set()


# ─── JWT callbacks ──────────────────────────────────────────
from app.extensions import jwt

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload["jti"] in BLOCKLIST

@jwt.user_identity_loader
def user_identity(user):
    return user if isinstance(user, str) else str(user)

@jwt.user_lookup_loader
def user_lookup(_jwt_header, jwt_data):
    return User.query.get(jwt_data["sub"])


# ─── Helpers ────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def check_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def make_tokens(user_id: str, role: str):
    additional_claims = {"role": role}
    access  = create_access_token(identity=user_id, additional_claims=additional_claims)
    refresh = create_refresh_token(identity=user_id, additional_claims=additional_claims)
    return access, refresh


# ─── Register ───────────────────────────────────────────────
@auth_bp.post("/register")
def register():
    """
    Body (family):
      { "email", "password", "full_name", "role": "family", "phone"? }

    Body (caregiver — extra fields):
      { ..., "role": "caregiver", "bio"?, "hourly_rate", "years_experience"? }
    """
    body = request.get_json(silent=True) or {}

    # Validation
    required = ["email", "password", "full_name", "role"]
    missing  = [f for f in required if not body.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    role = body["role"]
    if role not in ("family", "caregiver"):
        return jsonify({"error": "role must be 'family' or 'caregiver'"}), 400

    if role == "caregiver" and not body.get("hourly_rate"):
        return jsonify({"error": "hourly_rate is required for caregivers"}), 400

    if User.query.filter_by(email=body["email"].lower()).first():
        return jsonify({"error": "Email already registered"}), 409

    # Create user
    user = User(
        email         = body["email"].lower().strip(),
        password_hash = hash_password(body["password"]),
        role          = role,
        full_name     = body["full_name"].strip(),
        phone         = body.get("phone"),
        location      = body.get("location"),
    )
    db.session.add(user)
    db.session.flush()  # get user.id before committing

    # If caregiver — create caregiver profile too
    if role == "caregiver":
        caregiver = Caregiver(
            id               = user.id,
            bio              = body.get("bio"),
            hourly_rate      = float(body["hourly_rate"]),
            years_experience = int(body.get("years_experience", 0)),
            care_types       = body.get("care_types", []),
        )
        db.session.add(caregiver)

    db.session.commit()

    access, refresh = make_tokens(user.id, role)

    return jsonify({
        "access_token":  access,
        "refresh_token": refresh,
        "user":          user.to_dict(),
    }), 201


# ─── Login ──────────────────────────────────────────────────
@auth_bp.post("/login")
def login():
    """
    Same endpoint for both roles — role is detected from the user record.
    Body: { "email", "password" }
    """
    body = request.get_json(silent=True) or {}

    email    = (body.get("email") or "").lower().strip()
    password = body.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401

    access, refresh = make_tokens(user.id, user.role)

    # Build response — include caregiver profile if applicable
    resp = {
        "access_token":  access,
        "refresh_token": refresh,
        "user":          user.to_dict(),
    }
    if user.role == "caregiver" and user.caregiver_profile:
        resp["caregiver_profile"] = user.caregiver_profile.to_dict()

    return jsonify(resp), 200


# ─── Refresh ────────────────────────────────────────────────
@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    user    = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    access, _ = make_tokens(user.id, user.role)
    return jsonify({"access_token": access}), 200


# ─── Logout ─────────────────────────────────────────────────
@auth_bp.post("/logout")
@jwt_required(verify_type=False)
def logout():
    jti = get_jwt()["jti"]
    BLOCKLIST.add(jti)
    return jsonify({"message": "Logged out"}), 200


# ─── Me ─────────────────────────────────────────────────────
@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user    = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    resp = {"user": user.to_dict()}
    if user.role == "caregiver" and user.caregiver_profile:
        resp["caregiver_profile"] = user.caregiver_profile.to_dict()
    return jsonify(resp), 200