# server/seed.py
from app import create_app
from extensions import db
from models import User, Clinic, Article, Appointment, Report, Review
from datetime import datetime, timedelta, UTC
import random
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    print("Creating database tables (if missing)...")
    db.create_all()

    print("Seeding database...")

    # Clear existing data to avoid conflicts
    db.session.query(Review).delete()
    db.session.query(Appointment).delete()
    db.session.query(Report).delete()
    db.session.query(Article).delete()
    db.session.query(Clinic).delete()
    db.session.query(User).delete()
    db.session.commit()

    # --- USERS ---
    users = [
        {
            "full_name": "John Doe",
            "email": "john.doe@example.com",
            "phone_number": "+254712345678",
            "password": "123",
            "role": "patient",
        },
        {
            "full_name": "Faith Wanjiku",
            "email": "faith.wanjiku@example.com",
            "phone_number": "+254711223344",
            "password": "123",
            "role": "patient",
        },
        {
            "full_name": "Admin User",
            "email": "admin@example.com",
            "phone_number": "+254700000000",
            "password": "admin123",
            "role": "admin",
        },
        {
            "full_name": "Alice Mwende",
            "email": "alice.mwende@example.com",
            "phone_number": "+254700123456",
            "password": "123",
            "role": "patient",
        },
        {
            "full_name": "Bob Otieno",
            "email": "bob.otieno@example.com",
            "phone_number": "+254700654321",
            "password": "123",
            "role": "patient",
        },
        {
            "full_name": "Dr. Amina Mohamed",
            "email": "amina.mohamed@example.com",
            "phone_number": "+254722334455",
            "password": "123",
            "role": "admin",
        },
        {
            "full_name": "Dr. Peter Karanja",
            "email": "peter.karanja@example.com",
            "phone_number": "+254711998877",
            "password": "123",
            "role": "admin",
        },
        {
            "full_name": "Dr. Leah Chebet",
            "email": "leah.chebet@example.com",
            "phone_number": "+254733445566",
            "password": "123",
            "role": "admin",
        },
        {
            "full_name": "Erick Mwangi",
            "email": "erick.mwangi@example.com",
            "phone_number": "+254700987654",
            "password": "123",
            "role": "patient",
        },
    ]

    # --- CLINICS ---
    clinics = [
        {
            "name": "Mombasa Community Health Center",
            "location": "Nyali, Mombasa",
            "phone": "+254711987654",
            "email": "mombasa@health.go.ke",
            "password": generate_password_hash("clinic123"),
            "opening_time": "08:00",
            "closing_time": "17:00",
            "operating_hours": [
                {"day": "Monday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Tuesday", "open": "08:00", "close": "17:00", "closed": False},
                {
                    "day": "Wednesday",
                    "open": "08:00",
                    "close": "17:00",
                    "closed": False,
                },
                {"day": "Thursday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Friday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Saturday", "open": "09:00", "close": "13:00", "closed": False},
                {"day": "Sunday", "open": None, "close": None, "closed": True},
            ],
            "services": [
                "General Checkup",
                "Vaccination",
                "Blood Test",
                "Follow-up Visit",
            ],
            "doctors": [
                {"name": "Dr. Amina Mohamed", "specialty": "General Practitioner"},
                {"name": "Dr. Peter Karanja", "specialty": "Pediatrician"},
            ],
        },
        {
            "name": "Nairobi Wellness Hospital",
            "location": "Kilimani, Nairobi",
            "phone": "+254701223344",
            "email": "info@nairobiwellness.co.ke",
            "password": generate_password_hash("clinic123"),
            "opening_time": "08:00",
            "closing_time": "17:00",
            "operating_hours": [
                {"day": "Monday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Tuesday", "open": "08:00", "close": "17:00", "closed": False},
                {
                    "day": "Wednesday",
                    "open": "08:00",
                    "close": "17:00",
                    "closed": False,
                },
                {"day": "Thursday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Friday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Saturday", "open": "09:00", "close": "13:00", "closed": False},
                {"day": "Sunday", "open": None, "close": None, "closed": True},
            ],
            "services": [
                "General Checkup",
                "Antenatal Checkup",
                "Nutrition Counseling",
                "Mental Health Consultation",
            ],
            "doctors": [
                {"name": "Dr. Amina Mohamed", "specialty": "General Practitioner"},
                {"name": "Dr. Peter Karanja", "specialty": "Pediatrician"},
            ],
        },
        {
            "name": "Eldoret Medical Center",
            "location": "Eldoret, Uasin Gishu",
            "phone": "+254700112233",
            "email": "eldoret@medical.co.ke",
            "password": generate_password_hash("clinic123"),
            "opening_time": "08:00",
            "closing_time": "17:00",
            "operating_hours": [
                {"day": "Monday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Tuesday", "open": "08:00", "close": "17:00", "closed": False},
                {
                    "day": "Wednesday",
                    "open": "08:00",
                    "close": "17:00",
                    "closed": False,
                },
                {"day": "Thursday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Friday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Saturday", "open": "09:00", "close": "13:00", "closed": False},
                {"day": "Sunday", "open": None, "close": None, "closed": True},
            ],
            "services": [
                "Dental Checkup",
                "General Checkup",
                "Blood Test",
                "Vaccination",
            ],
            "doctors": [
                {"name": "Dr. Amina Mohamed", "specialty": "General Practitioner"},
                {"name": "Dr. Peter Karanja", "specialty": "Pediatrician"},
            ],
        },
        {
            "name": "Kisumu Lakeside Hospital",
            "location": "Milimani, Kisumu",
            "phone": "+254713334455",
            "email": "kisumu@lakeside.co.ke",
            "password": generate_password_hash("clinic123"),
            "opening_time": "08:00",
            "closing_time": "17:00",
            "operating_hours": [
                {"day": "Monday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Tuesday", "open": "08:00", "close": "17:00", "closed": False},
                {
                    "day": "Wednesday",
                    "open": "08:00",
                    "close": "17:00",
                    "closed": False,
                },
                {"day": "Thursday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Friday", "open": "08:00", "close": "17:00", "closed": False},
                {"day": "Saturday", "open": "09:00", "close": "13:00", "closed": False},
                {"day": "Sunday", "open": None, "close": None, "closed": True},
            ],
            "services": ["General Checkup", "Follow-up Visit", "Nutrition Counseling"],
            "doctors": [
                {"name": "Dr. Amina Mohamed", "specialty": "General Practitioner"},
                {"name": "Dr. Peter Karanja", "specialty": "Pediatrician"},
            ],
        },
        {
            "name": "Makadara Health Centre",
            "location": "Makadara, Nairobi",
            "phone": "+25470011343",
            "email": "madaraka@medical.co.ke",
            "password": generate_password_hash("clinic123"),
            "opening_time": "08:00",
            "closing_time": "22:00",
            "operating_hours": [
                {"day": "Monday", "open": "08:00", "close": "22:00", "closed": False},
                {"day": "Tuesday", "open": "08:00", "close": "22:00", "closed": False},
                {
                    "day": "Wednesday",
                    "open": "08:00",
                    "close": "22:00",
                    "closed": False,
                },
                {"day": "Thursday", "open": "08:00", "close": "22:00", "closed": False},
                {"day": "Friday", "open": "08:00", "close": "22:00", "closed": False},
                {"day": "Saturday", "open": "09:00", "close": "13:00", "closed": False},
                {"day": "Sunday", "open": None, "close": None, "closed": True},
            ],
            "services": ["General Checkup", "Vaccination", "Blood Test"],
            "doctors": [
                {"name": "Dr. Amina Mohamed", "specialty": "General Practitioner"},
                {"name": "Dr. Peter Karanja", "specialty": "Pediatrician"},
            ],
        },
    ]

    # --- ARTICLES ---
    articles = [
        {
            "title": "Antenatal Care in Kenya: What to Expect During Your Pregnancy Journey",
            "category": "Maternity",
            "author": "Dr. Amina Mohamed",
            "date": "2025-07-01",
            "read_time": "6 min",
            "image": "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJlZ25hbmN5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            "summary": "Antenatal care (ANC) is crucial for a healthy pregnancy and safe delivery.",
            "content": "Antenatal care (ANC) in Kenya is a vital part of every woman’s pregnancy journey...",
            "published": True,
            "is_trending": True,
        },
        {
            "title": "Managing Hypertension in Kenya: Simple Steps for a Healthier Life",
            "category": "Chronic Illness",
            "author": "Dr. Peter Karanja",
            "date": "2025-08-10",
            "read_time": "8 min",
            "image": "https://plus.unsplash.com/premium_photo-1673958771843-12c73b278bd0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHlwZXJ0ZW5zaW9ufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            "summary": "Managing hypertension in Kenya requires simple, consistent lifestyle choices...",
            "content": "### Understanding Hypertension\nHigh blood pressure...",
            "published": True,
            "is_trending": False,
        },
        {
            "title": "Mental Health Awareness in Kenya: Breaking the Stigma",
            "category": "Mental Health",
            "author": "Dr. Leah Chebet",
            "date": "2025-09-05",
            "read_time": "7 min",
            "image": "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
            "summary": "Mental health awareness in Kenya has gained growing attention...",
            "content": "Mental health awareness in Kenya has gained growing attention...",
            "published": True,
            "is_trending": True,
        },
        {
            "title": "Nutrition Tips for Busy Kenyans",
            "category": "Nutrition",
            "author": "Dr. Amina Mohamed",
            "date": "2025-09-15",
            "read_time": "5 min",
            "image": "https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG51dHJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            "summary": "Healthy eating tips for busy lifestyles.",
            "content": "Good nutrition is essential for maintaining energy, focus, and long-term health...",
            "published": True,
            "is_trending": False,
        },
        {
            "title": "COVID-19 Updates and Safety Measures",
            "category": "Public Health",
            "author": "Dr. Peter Karanja",
            "date": "2025-10-01",
            "read_time": "4 min",
            "image": "https://plus.unsplash.com/premium_photo-1661603901299-c8554e8b8678?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y292aWQlMjAxOXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
            "summary": "Latest COVID-19 updates in Kenya.",
            "content": "In October 2025, the World Health Organization (WHO) reported about 159,103 new confirmed COVID-19 cases worldwide...",
            "published": True,
            "is_trending": True,
        },
    ]

    # --- REPORTS ---
    reports = [
        {
            "title": "Monthly Clinic Performance - Nairobi Wellness",
            "category": "Performance",
            "author": "Admin User",
            "date": "2025-10-01",
            "summary": "Monthly stats for Nairobi Wellness",
            "content": "Detailed stats...",
        },
        {
            "title": "Monthly Clinic Performance - Mombasa Community Health Center",
            "category": "Performance",
            "author": "Admin User",
            "date": "2025-10-01",
            "summary": "Monthly stats for Mombasa Community Health Center",
            "content": "Detailed stats...",
        },
    ]

    # --- SEED USERS ---
    for u in users:
        if not User.query.filter_by(email=u["email"]).first():
            user = User(
                full_name=u["full_name"],
                email=u["email"],
                phone_number=u.get("phone_number"),
                role=u["role"],
                clinic_id=None,
            )
            user.set_password(u["password"])
            db.session.add(user)
    db.session.commit()

    # --- SEED CLINICS ---
    for c in clinics:
        existing_clinic = Clinic.query.filter_by(email=c["email"]).first()
        if not existing_clinic:
            clinic = Clinic(
                name=c["name"],
                location=c["location"],
                phone=c["phone"],
                email=c["email"],
                password=c["password"],
                opening_time=c.get("opening_time", "08:00"),
                closing_time=c.get("closing_time", "17:00"),
                services=c.get("services", []),
                doctors=c.get("doctors", []),
                operating_hours=c.get("operating_hours", []),
                coordinates={"lat": 0.0, "lng": 0.0},
                rating=0.0,
                reviews=0,
                verified=True,
                status="approved",
                created_at=datetime.now(UTC),
            )
            db.session.add(clinic)
            db.session.flush()

            if not User.query.filter_by(email=c["email"]).first():
                clinic_user = User(
                    full_name=c["name"],
                    email=c["email"],
                    phone_number=c["phone"],
                    role="clinic",
                    clinic_id=clinic.id,
                )
                clinic_user.set_password("clinic123")
                db.session.add(clinic_user)
    db.session.commit()

    # --- SEED ARTICLES ---
    for a in articles:
        if not Article.query.filter_by(title=a["title"]).first():
            db.session.add(Article(**a))
    db.session.commit()

    # --- SEED REPORTS ---
    for r in reports:
        if not Report.query.filter_by(title=r["title"]).first():
            db.session.add(Report(**r))
    db.session.commit()

    # --- SEED REVIEWS ---
    if Review.query.count() == 0:
        clinics_list = Clinic.query.all()
        clinic_ids = [c.id for c in clinics_list]
        reviews = [
            (
                Review(
                    clinic_id=1,
                    user_id=1,
                    rating=4.5,
                    comment="Very professional and clean.",
                    created_at=datetime.now(UTC),
                )
                if 1 in clinic_ids
                else None
            ),
            (
                Review(
                    clinic_id=2,
                    user_id=2,
                    rating=5.0,
                    comment="Loved the service!",
                    created_at=datetime.now(UTC),
                )
                if 2 in clinic_ids
                else None
            ),
            (
                Review(
                    clinic_id=4,
                    user_id=1,
                    rating=4.2,
                    comment="Fast emergency response.",
                    created_at=datetime.now(UTC),
                )
                if 4 in clinic_ids
                else None
            ),
        ]
        reviews = [r for r in reviews if r is not None]
        db.session.add_all(reviews)
    db.session.commit()

    # --- SEED DYNAMIC APPOINTMENTS ---
    if Appointment.query.count() == 0:
        patients = User.query.filter_by(role="patient").all()
        clinics_list = Clinic.query.all()
        doctors = (
            User.query.filter_by(role="admin").filter(User.full_name.like("Dr.%")).all()
        )

        services_pool = [
            "General Checkup",
            "Antenatal Checkup",
            "Mental Health Consultation",
            "Nutrition Counseling",
            "Vaccination",
            "Blood Test",
            "Follow-up Visit",
            "Dental Checkup",
        ]

        appointments = []
        start_date = datetime(2025, 11, 1)

        for patient in patients:
            for _ in range(random.randint(2, 3)):
                clinic = random.choice(clinics_list)
                appointment_date = start_date + timedelta(days=random.randint(0, 30))
                appointment_time = datetime.strptime(
                    f"{random.randint(8, 16)}:{random.choice(['00', '30'])}", "%H:%M"
                ).time()
                doctor_name = (
                    random.choice(doctors).full_name if doctors else "Dr. Not Assigned"
                )
                service = (
                    random.choice(clinic.services)
                    if clinic.services
                    else random.choice(services_pool)
                )

                appointments.append(
                    Appointment(
                        patient_id=patient.id,
                        clinic_id=clinic.id,
                        clinic_name=clinic.name,
                        doctor=doctor_name,
                        service=service,
                        date=appointment_date.date(),
                        time=appointment_time,
                        status="Scheduled",
                        notes="Auto-generated appointment for testing",
                        created_at=datetime.now(UTC),
                    )
                )
        db.session.add_all(appointments)
        print(
            f"Seeded {len(appointments)} dynamic appointments for {len(patients)} patients."
        )
    db.session.commit()

    print("Seeding complete — everything inserted with no duplicates.")

