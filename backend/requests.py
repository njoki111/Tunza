"""
Request / Booking Routes
POST /api/requests                    — family creates a request
GET  /api/requests                    — get own requests (family or caregiver)
GET  /api/requests/<id>               — get single request
PATCH /api/requests/<id>/status       — update status (role-gated transitions)
POST /api/requests/<id>/review        — family submits review (completed only)
"""
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.extensions import db
from app.models import Request, Review, Caregiver

requests_bp = Blueprint("requests", __name__)

# State machine: who can move to which status
TRANSITIONS = {
    "family": {
        "pending":    ["cancelled"],        # family can cancel before confirmation
    },
    "caregiver": {
        "pending":    ["confirmed", "cancelled"],
        "confirmed":  ["in_progress", "cancelled"],
        "in_progress":["completed"],
    },
}


# ─── Create request ─────────────────────────────────────────
@requests_bp.post("")
@jwt_required()
def create_request():
    claims = get_jwt()
    if claims.get("role") != "family":
        return jsonify({"error": "Only family accounts can create requests"}), 403

    body    = request.get_json(silent=True) or {}
    user_id = get_jwt_identity()

    required = ["caregiver_id", "care_type", "start_datetime", "end_datetime", "agreed_rate"]
    missing  = [f for f in required if not body.get(f)]
    if missing:
        return jsonify({"error": f"Missing: {', '.join(missing)}"}), 400

    # Verify caregiver exists
    caregiver = Caregiver.query.get(body["caregiver_id"])
    if not caregiver:
        return jsonify({"error": "Caregiver not found"}), 404

    try:
        start = datetime.fromisoformat(body["start_datetime"])
        end   = datetime.fromisoformat(body["end_datetime"])
    except ValueError:
        return jsonify({"error": "Invalid datetime format. Use ISO 8601."}), 400

    if end <= start:
        return jsonify({"error": "end_datetime must be after start_datetime"}), 400

    req = Request(
        family_id      = user_id,
        caregiver_id   = body["caregiver_id"],
        care_type      = body["care_type"],
        start_datetime = start,
        end_datetime   = end,
        agreed_rate    = float(body["agreed_rate"]),
        notes          = body.get("notes"),
    )
    db.session.add(req)
    db.session.commit()
    return jsonify(req.to_dict()), 201


# ─── List requests ───────────────────────────────────────────
@requests_bp.get("")
@jwt_required()
def list_requests():
    claims  = get_jwt()
    role    = claims.get("role")
    user_id = get_jwt_identity()

    if role == "family":
        reqs = Request.query.filter_by(family_id=user_id)\
                            .order_by(Request.created_at.desc()).all()
    elif role == "caregiver":
        reqs = Request.query.filter_by(caregiver_id=user_id)\
                            .order_by(Request.created_at.desc()).all()
    else:  # admin
        reqs = Request.query.order_by(Request.created_at.desc()).all()

    return jsonify([r.to_dict() for r in reqs]), 200


# ─── Single request ─────────────────────────────────────────
@requests_bp.get("/<req_id>")
@jwt_required()
def get_request(req_id: str):
    claims  = get_jwt()
    role    = claims.get("role")
    user_id = get_jwt_identity()

    req = Request.query.get_or_404(req_id)

    # Access control
    if role == "family"    and req.family_id    != user_id:
        return jsonify({"error": "Forbidden"}), 403
    if role == "caregiver" and req.caregiver_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(req.to_dict()), 200


# ─── Update status ───────────────────────────────────────────
@requests_bp.patch("/<req_id>/status")
@jwt_required()
def update_status(req_id: str):
    claims     = get_jwt()
    role       = claims.get("role")
    user_id    = get_jwt_identity()
    body       = request.get_json(silent=True) or {}
    new_status = body.get("status")

    req = Request.query.get_or_404(req_id)

    # Must be participant
    if role == "family"    and req.family_id    != user_id:
        return jsonify({"error": "Forbidden"}), 403
    if role == "caregiver" and req.caregiver_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    allowed = TRANSITIONS.get(role, {}).get(req.status, [])
    if new_status not in allowed:
        return jsonify({
            "error":   f"Cannot move from '{req.status}' to '{new_status}' as {role}",
            "allowed": allowed,
        }), 422

    req.status = new_status
    db.session.commit()
    return jsonify(req.to_dict()), 200


# ─── Submit review ───────────────────────────────────────────
@requests_bp.post("/<req_id>/review")
@jwt_required()
def submit_review(req_id: str):
    claims  = get_jwt()
    user_id = get_jwt_identity()

    if claims.get("role") != "family":
        return jsonify({"error": "Only families can submit reviews"}), 403

    req = Request.query.get_or_404(req_id)

    if req.family_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    if req.status != "completed":
        return jsonify({"error": "Can only review completed requests"}), 422

    if req.review:
        return jsonify({"error": "Review already submitted"}), 409

    body   = request.get_json(silent=True) or {}
    rating = body.get("rating")
    if not rating or not (1 <= int(rating) <= 5):
        return jsonify({"error": "rating must be 1–5"}), 400

    review = Review(
        request_id   = req_id,
        reviewer_id  = user_id,
        caregiver_id = req.caregiver_id,
        rating       = int(rating),
        comment      = body.get("comment"),
    )
    db.session.add(review)

    # Recalculate avg_rating
    caregiver = Caregiver.query.get(req.caregiver_id)
    all_ratings = [r.rating for r in caregiver.reviews] + [int(rating)]
    caregiver.avg_rating   = sum(all_ratings) / len(all_ratings)
    caregiver.total_reviews = len(all_ratings)

    db.session.commit()
    return jsonify(review.to_dict()), 201