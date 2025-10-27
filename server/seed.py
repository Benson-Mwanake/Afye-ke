from app import create_app
from extensions import db
from models import User, Clinic, CHV, Booking, Article
from datetime import datetime, timedelta
import random
import uuid

app = create_app()
app.app_context().push()

# ----------------------------------------
# Helper function
# ----------------------------------------
def simple_slug(title):
    return title.lower().replace(" ", "-")

# Drop and recreate all tables
db.drop_all()
db.create_all()

# ----------------------------------------
# USERS
# ----------------------------------------
users_data = [
    {"full_name": "John Doe", "email": "john@example.com", "phone_number": "+254712345678", "password": "123", "role": "patient"},
    {"full_name": "Soraya Ali", "email": "soraya@example.com", "phone_number": "+254798765432", "password": "123", "role": "patient"},
    {"full_name": "Kyrell Kim", "email": "kyrell@example.com", "phone_number": "+254711234567", "password": "123", "role": "patient"},
    {"full_name": "Jeremy Njoroge", "email": "jeremy@example.com", "phone_number": "+254722112233", "password": "123", "role": "patient"},
    {"full_name": "Erskine Muli", "email": "erskine@example.com", "phone_number": "+254733445566", "password": "123", "role": "patient"},
    {"full_name": "Jane Mwende", "email": "jane@example.com", "phone_number": "+254799111222", "password": "123", "role": "patient"},
    {"full_name": "Peter Ouma", "email": "peter@example.com", "phone_number": "+254701556677", "password": "123", "role": "patient"},
    {"full_name": "Faith Wanjiku", "email": "faith@example.com", "phone_number": "+254710998877", "password": "123", "role": "patient"},
    {"full_name": "Brian Kiptoo", "email": "brian@example.com", "phone_number": "+254743221100", "password": "123", "role": "patient"},
    {"full_name": "Admin Officer", "email": "admin@afyalink.com", "phone_number": "+254700000001", "password": "admin123", "role": "admin"},
]

users = []
for u in users_data:
    user = User(
        full_name=u["full_name"],
        email=u["email"],
        phone_number=u["phone_number"],
        role=u["role"]
    )
    user.set_password(u["password"])
    db.session.add(user)
    users.append(user)
db.session.commit()

# ----------------------------------------
# CLINICS
# ----------------------------------------
clinic_names = [
    "Westlands Family Clinic", "Mombasa Community Health Center",
    "Nakuru Wellness Hospital", "Kisumu Medical Plaza",
    "Machakos Health Hub", "Eldoret Family Care",
    "Karen Trust Clinic", "Thika Road Medical Center",
    "Ruiru Community Clinic", "Langata Health & Dental"
]

clinics = []
for name in clinic_names:
    clinic = Clinic(
        id=str(uuid.uuid4()),
        name=name,
        location=random.choice(["Nairobi", "Mombasa", "Nakuru", "Eldoret", "Kisumu"]),
        coordinates=[round(random.uniform(-4.6, 1.5), 4), round(random.uniform(36.5, 39.7), 4)],
        services=random.sample(["General Checkup", "Dental", "Lab Tests", "Maternity", "Pediatrics", "Nutrition"], 3),
        rating=round(random.uniform(3.8, 5.0), 1),
        reviews=random.randint(50, 200),
        phone=f"+2547{random.randint(10000000,99999999)}",
        email=f"{name.lower().replace(' ', '')}@clinic.com",
        operating_hours=random.choice(["Mon–Sat: 8AM–6PM", "Mon–Sun: 7AM–7PM"]),
        verified=True,
        status="approved"
    )
    db.session.add(clinic)
    clinics.append(clinic)
db.session.commit()

# ----------------------------------------
# CHVs
# ----------------------------------------
chv_names = [
    "Amina Otieno", "John Mwenda", "Esther Wairimu", "Peter Njoroge",
    "Mercy Atieno", "James Muli", "Lucy Njeri", "Paul Kiptoo",
    "Agnes Wambui", "Collins Odhiambo"
]

chvs = []
for name in chv_names:
    chv = CHV(
        id=str(uuid.uuid4()),
        full_name=name,
        phone_number=f"+2547{random.randint(10000000, 99999999)}",
        assigned_patients=[random.choice(users).id for _ in range(3)]
    )
    db.session.add(chv)
    chvs.append(chv)
db.session.commit()

# ----------------------------------------
# BOOKINGS
# ----------------------------------------
for _ in range(10):
    u = random.choice(users[:-1])  # exclude admin
    c = random.choice(clinics)
    booking = Booking(
        id=str(uuid.uuid4()),
        patient_id=u.id,
        clinic_id=c.id,
        clinic_name=c.name,
        doctor=random.choice(["Dr. Kyrell Kim", "Dr. Soraya Ali", "Dr. Jeremy Njoroge"]),
        service=random.choice(c.services),
        date=(datetime.utcnow() + timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d"),
        time=f"{random.randint(8, 17)}:00",
        status=random.choice(["Pending", "Confirmed", "Completed"]),
        notes="Routine check-up appointment."
    )
    db.session.add(booking)
db.session.commit()

# ----------------------------------------
# ARTICLES
# ----------------------------------------
article_titles = [
    "How to Protect Your Family from Malaria",
    "The Importance of Annual Health Checkups",
    "Understanding Child Immunization",
    "Healthy Eating for Busy Adults",
    "The Role of CHVs in Community Health",
    "Early Detection of Diabetes",
    "Coping with Stress in Urban Life",
    "The Power of Physical Exercise",
    "Safe Motherhood Practices",
    "Common Myths About Vaccines"
]

for title in article_titles:
    article = Article(
        id=str(uuid.uuid4()),
        title=title,
        category=random.choice(["Prevention", "Wellness", "Community", "Nutrition"]),
        author=random.choice(["Dr. Kyrell Kim", "Dr. Soraya Ali", "Dr. Jeremy Njoroge"]),
        date=(datetime.utcnow() - timedelta(days=random.randint(0, 60))).strftime("%Y-%m-%d"),
        read_time=f"{random.randint(3,7)} min",
        image=f"https://example.com/{simple_slug(title)}.jpg",
        summary=f"A quick overview of {title.lower()}.",
        content=f"Full article content about {title.lower()} and how it affects your community.",
        published=True
    )
    db.session.add(article)
db.session.commit()

print(" PostgreSQL seeding complete — 10 users, 10 clinics, 10 CHVs, 10 bookings, 10 articles added successfully!")
