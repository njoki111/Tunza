"""
CareBridge ORM Models
Mirrors the Supabase PostgreSQL schema exactly.
"""
import uuid
from datetime import datetime
from app.extensions import db

# ─────────────────────────────────────────────
# ENUMS (kept as plain strings in DB)
# ─────────────────────────────────────────────
USER_ROLES   = ("family", "caregiver", "admin")
REQUEST_STATUSES = ("pending", "confirmed", "in_progress", "completed", "cancelled")
CARE_TYPES   = ("hourly", "live_in", "overnight", "respite")


def gen_uuid():
    return str(uuid.uuid4())


# ─────────────────────────────────────────────
# JUNCTION TABLES (many-to-many)
# ─────────────────────────────────────────────
caregiver_specialties = db.Table(
    "caregiver_specialties",
    db.Column("caregiver_id", db.String, db.ForeignKey("caregivers.id", ondelete="CASCADE"), primary_key=True),
    db.Column("specialty_id", db.Integer, db.ForeignKey("specialties.id", ondelete="CASCADE"), primary_key=True),
)

caregiver_languages = db.Table(
    "caregiver_languages",
    db.Column("caregiver_id", db.String, db.ForeignKey("caregivers.id", ondelete="CASCADE"), primary_key=True),
    db.Column("language_id", db.Integer, db.ForeignKey("languages.id", ondelete="CASCADE"), primary_key=True),
)


# ─────────────────────────────────────────────
# USERS
# ─────────────────────────────────────────────
class User(db.Model):
    __tablename__ = "users"

    id          = db.Column(db.String,   primary_key=True, default=gen_uuid)
    email       = db.Column(db.String,   unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String, nullable=False)
    role        = db.Column(db.String,   nullable=False, default="family")
    full_name   = db.Column(db.String,   nullable=False)
    phone       = db.Column(db.String)
    avatar_url  = db.Column(db.String)
    location    = db.Column(db.String)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    caregiver_profile = db.relationship("Caregiver", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":        self.id,
            "email":     self.email,
            "role":      self.role,
            "full_name": self.full_name,
            "phone":     self.phone,
            "avatar_url":self.avatar_url,
            "location":  self.location,
        }


# ─────────────────────────────────────────────
# SPECIALTIES / LANGUAGES (lookup tables)
# ─────────────────────────────────────────────
class Specialty(db.Model):
    __tablename__ = "specialties"
    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String,  unique=True, nullable=False)

class Language(db.Model):
    __tablename__ = "languages"
    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String,  unique=True, nullable=False)


# ─────────────────────────────────────────────
# CAREGIVERS
# ─────────────────────────────────────────────
class Caregiver(db.Model):
    __tablename__ = "caregivers"

    id              = db.Column(db.String, db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    bio             = db.Column(db.Text)
    hourly_rate     = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    years_experience= db.Column(db.SmallInteger, default=0)
    care_types      = db.Column(db.ARRAY(db.String), default=[])
    avg_rating      = db.Column(db.Numeric(3, 2))
    total_reviews   = db.Column(db.Integer, default=0)
    is_verified     = db.Column(db.Boolean, default=False)
    is_available    = db.Column(db.Boolean, default=True)
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at      = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user            = db.relationship("User", back_populates="caregiver_profile")
    specialties     = db.relationship("Specialty", secondary=caregiver_specialties, backref="caregivers")
    languages       = db.relationship("Language",  secondary=caregiver_languages,  backref="caregivers")
    certifications  = db.relationship("Certification", back_populates="caregiver", cascade="all, delete-orphan")
    availability    = db.relationship("Availability",  back_populates="caregiver", cascade="all, delete-orphan")
    reviews         = db.relationship("Review", back_populates="caregiver")

    def to_dict(self):
        return {
            "id":               self.id,
            "full_name":        self.user.full_name if self.user else None,
            "avatar_url":       self.user.avatar_url if self.user else None,
            "location":         self.user.location if self.user else None,
            "bio":              self.bio,
            "hourly_rate":      float(self.hourly_rate),
            "years_experience": self.years_experience,
            "care_types":       self.care_types or [],
            "avg_rating":       float(self.avg_rating) if self.avg_rating else None,
            "total_reviews":    self.total_reviews,
            "is_verified":      self.is_verified,
            "is_available":     self.is_available,
            "specialties":      [s.name for s in self.specialties],
            "languages":        [l.name for l in self.languages],
            "certifications":   [c.to_dict() for c in self.certifications],
            "availability":     [a.to_dict() for a in self.availability],
        }


# ─────────────────────────────────────────────
# CERTIFICATIONS
# ─────────────────────────────────────────────
class Certification(db.Model):
    __tablename__ = "certifications"

    id           = db.Column(db.String,  primary_key=True, default=gen_uuid)
    caregiver_id = db.Column(db.String,  db.ForeignKey("caregivers.id", ondelete="CASCADE"), nullable=False)
    name         = db.Column(db.String,  nullable=False)
    issuing_body = db.Column(db.String)
    issued_date  = db.Column(db.Date)
    expiry_date  = db.Column(db.Date)
    document_url = db.Column(db.String)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    caregiver    = db.relationship("Caregiver", back_populates="certifications")

    def to_dict(self):
        return {
            "id":           self.id,
            "name":         self.name,
            "issuing_body": self.issuing_body,
            "issued_date":  str(self.issued_date) if self.issued_date else None,
            "expiry_date":  str(self.expiry_date) if self.expiry_date else None,
        }


# ─────────────────────────────────────────────
# AVAILABILITY
# ─────────────────────────────────────────────
class Availability(db.Model):
    __tablename__ = "availability"

    id           = db.Column(db.String,   primary_key=True, default=gen_uuid)
    caregiver_id = db.Column(db.String,   db.ForeignKey("caregivers.id", ondelete="CASCADE"), nullable=False)
    day_of_week  = db.Column(db.SmallInteger, nullable=False)  # 0=Sun … 6=Sat
    start_time   = db.Column(db.Time,     nullable=False)
    end_time     = db.Column(db.Time,     nullable=False)

    caregiver    = db.relationship("Caregiver", back_populates="availability")

    def to_dict(self):
        return {
            "id":         self.id,
            "day_of_week":self.day_of_week,
            "start_time": str(self.start_time),
            "end_time":   str(self.end_time),
        }


# ─────────────────────────────────────────────
# REQUESTS (bookings)
# ─────────────────────────────────────────────
class Request(db.Model):
    __tablename__ = "requests"

    id             = db.Column(db.String,   primary_key=True, default=gen_uuid)
    family_id      = db.Column(db.String,   db.ForeignKey("users.id"),      nullable=False, index=True)
    caregiver_id   = db.Column(db.String,   db.ForeignKey("caregivers.id"), nullable=False, index=True)
    care_type      = db.Column(db.String,   nullable=False)
    status         = db.Column(db.String,   nullable=False, default="pending", index=True)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime   = db.Column(db.DateTime, nullable=False)
    notes          = db.Column(db.Text)
    agreed_rate    = db.Column(db.Numeric(10, 2), nullable=False)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at     = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    family         = db.relationship("User",      foreign_keys=[family_id])
    caregiver      = db.relationship("Caregiver", foreign_keys=[caregiver_id])
    review         = db.relationship("Review",    back_populates="request", uselist=False)

    def to_dict(self):
        return {
            "id":             self.id,
            "family_id":      self.family_id,
            "caregiver_id":   self.caregiver_id,
            "care_type":      self.care_type,
            "status":         self.status,
            "start_datetime": self.start_datetime.isoformat() if self.start_datetime else None,
            "end_datetime":   self.end_datetime.isoformat()   if self.end_datetime else None,
            "notes":          self.notes,
            "agreed_rate":    float(self.agreed_rate),
            "caregiver_name": self.caregiver.user.full_name if self.caregiver and self.caregiver.user else None,
            "caregiver_avatar":self.caregiver.user.avatar_url if self.caregiver and self.caregiver.user else None,
            "created_at":     self.created_at.isoformat() if self.created_at else None,
        }


# ─────────────────────────────────────────────
# REVIEWS
# ─────────────────────────────────────────────
class Review(db.Model):
    __tablename__ = "reviews"

    id           = db.Column(db.String,   primary_key=True, default=gen_uuid)
    request_id   = db.Column(db.String,   db.ForeignKey("requests.id",  ondelete="CASCADE"), nullable=False, unique=True)
    reviewer_id  = db.Column(db.String,   db.ForeignKey("users.id"),     nullable=False)
    caregiver_id = db.Column(db.String,   db.ForeignKey("caregivers.id"),nullable=False)
    rating       = db.Column(db.SmallInteger, nullable=False)
    comment      = db.Column(db.Text)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    request      = db.relationship("Request",   back_populates="review")
    caregiver    = db.relationship("Caregiver", back_populates="reviews")

    def to_dict(self):
        return {
            "id":          self.id,
            "request_id":  self.request_id,
            "reviewer_id": self.reviewer_id,
            "caregiver_id":self.caregiver_id,
            "rating":      self.rating,
            "comment":     self.comment,
            "created_at":  self.created_at.isoformat() if self.created_at else None,
        }