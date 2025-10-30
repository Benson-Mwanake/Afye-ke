import json
from datetime import datetime
from app import create_app
from extensions import db
from models import User, Clinic, Appointment, Article, SymptomHistory

app = create_app()
app.app_context().push()

db.drop_all()
db.create_all()

with open("db.json") as f:
    data = json.load(f)

# ---- USERS ----
for u in data.get("users", []):
    user = User(
        id=u["id"],
        fullName=u["fullName"],
        email=u["email"],
        phoneNumber=u.get("phoneNumber"),
        role=u.get("role", "patient"),
        profile=u.get("profile", {}),
        savedClinics=u.get("savedClinics", []),
        blocked=u.get("blocked", False),
    )
    user.set_password(u.get("password", "123"))
    db.session.add(user)

# ---- SYMPTOM HISTORY (the two entries at the bottom) ----
for s in data.get("symptomHistory", []):
    hist = SymptomHistory(
        id=s["id"],
        userId=s["userId"],
        symptoms=s["symptoms"],
        result=s["result"],
        timestamp=datetime.fromisoformat(s["timestamp"].replace("Z", "+00:00")),
    )
    db.session.add(hist)

db.session.commit()
print("Seeded from db.json – ready for frontend!")
