"""
Caregiver Routes
GET  /api/caregivers              — list (public, filterable)
GET  /api/caregivers/<id>         — detail (public)
PUT  /api/caregivers/profile      — update own profile (caregiver only)
POST /api/caregivers/availability — set availability (caregiver only)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.extensions import db
from app.models import Caregiver, Availability, User

caregivers_bp = Blueprint("caregivers", __name__)


def require_role(role: str):
    """Helper — call inside a route to guard by role."""
    claims = get_jwt()
    if claims.get("role") != role:
        return jsonify({"error": f"Requires role: {role}"}), 403
    return None


# ─── List ───────────────────────────────────────────────────
@caregivers_bp.get("")
def list_caregivers():
    """
    Optional query params:
      ?max_rate=50&specialty=Dementia Care&language=Swahili&available=true
    """
    query = Caregiver.query.filter_by(is_verified=True)

    max_rate = request.args.get("max_rate", type=float)
    if max_rate:
        query = query.filter(Caregiver.hourly_rate <= max_rate)

    available = request.args.get("available")
    if available == "true":
        query = query.filter_by(is_available=True)

    caregivers = query.order_by(Caregiver.avg_rating.desc().nullslast()).all()
    return jsonify([c.to_dict() for c in caregivers]), 200


# ─── Detail ─────────────────────────────────────────────────
@caregivers_bp.get("/<caregiver_id>")
def get_caregiver(caregiver_id: str):
    caregiver = Caregiver.query.get_or_404(caregiver_id)
    return jsonify(caregiver.to_dict()), 200


# ─── Update own profile ─────────────────────────────────────
@caregivers_bp.put("/profile")
@jwt_required()
def update_profile():
    err = require_role("caregiver")
    if err: return err

    user_id   = get_jwt_identity()
    caregiver = Caregiver.query.get_or_404(user_id)
    body      = request.get_json(silent=True) or {}

    # Updatable fields
    updatable = ["bio", "hourly_rate", "years_experience", "care_types", "is_available"]
    for field in updatable:
        if field in body:
            setattr(caregiver, field, body[field])

    # Also update user fields if provided
    user = User.query.get(user_id)
    for field in ["full_name", "phone", "location", "avatar_url"]:
        if field in body:
            setattr(user, field, body[field])

    db.session.commit()
    return jsonify(caregiver.to_dict()), 200


# ─── Set availability ────────────────────────────────────────
@caregivers_bp.post("/availability")
@jwt_required()
def set_availability():
    """
    Body: { "slots": [ { "day_of_week": 1, "start_time": "09:00", "end_time": "17:00" }, ... ] }
    Replaces all existing availability for this caregiver.
    """
    err = require_role("caregiver")
    if err: return err

    user_id = get_jwt_identity()
    body    = request.get_json(silent=True) or {}
    slots   = body.get("slots", [])

    if not isinstance(slots, list):
        return jsonify({"error": "'slots' must be a list"}), 400

    # Delete existing, re-insert
    Availability.query.filter_by(caregiver_id=user_id).delete()
    for slot in slots:
        a = Availability(
            caregiver_id = user_id,
            day_of_week  = slot["day_of_week"],
            start_time   = slot["start_time"],
            end_time     = slot["end_time"],
        )
        db.session.add(a)

    db.session.commit()
    caregiver = Caregiver.query.get(user_id)
    return jsonify({"availability": [a.to_dict() for a in caregiver.availability]}), 200