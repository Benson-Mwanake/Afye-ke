from app import create_app
from extensions import db
from models import User, Clinic, Article, Appointment, Report
from datetime import datetime

app = create_app()

with app.app_context():
    print("Clearing existing data...")
    db.drop_all()
    db.create_all()

    print("Seeding AfyaLink data...")

    # --- USERS ---
    users = [
        {"full_name": "John Doe", "email": "john.doe@example.com", "phone_number": "+254712345678", "password": "123", "role": "patient", "saved_clinics": ["1", "2"], "profile": {"dob":"1990-01-01","gender":"Male","country":"Nairobi","bloodType":"O+","allergies":"Penicillin","emergencyContact":"Jane Doe • +254700111111"}},
        {"full_name": "Faith Wanjiku", "email": "faith.wanjiku@example.com", "phone_number": "+254711223344", "password": "123", "role": "patient", "saved_clinics": ["3"], "profile": {"dob":"1996-05-12","gender":"Female","country":"Nakuru","bloodType":"A+","allergies":"None","emergencyContact":"David Wanjiku • +254722889900"}},
        {"full_name": "Admin User", "email": "admin@example.com", "phone_number": "+254700000000", "password": "admin123", "role": "admin", "saved_clinics": [], "profile": {"dob":"1980-01-01","gender":"Male","country":"Nairobi","bloodType":"B+","allergies":"None","emergencyContact":"N/A"}},
        {"full_name": "Alice Mwende", "email": "alice.mwende@example.com", "phone_number": "+254700123456", "password": "123", "role": "patient", "saved_clinics": ["2", "4"], "profile": {"dob":"1995-02-20","gender":"Female","country":"Nairobi","bloodType":"A-","allergies":"None","emergencyContact":"Bob Mwende • +254711111111"}},
        {"full_name": "Bob Otieno", "email": "bob.otieno@example.com", "phone_number": "+254700654321", "password": "123", "role": "patient", "saved_clinics": ["1"], "profile": {"dob":"1988-08-15","gender":"Male","country":"Kisumu","bloodType":"AB+","allergies":"Peanuts","emergencyContact":"Alice Otieno • +254722222222"}},
        {"full_name": "Dr. Amina Mohamed", "email": "amina.mohamed@example.com", "phone_number": "+254722334455", "password": "123", "role": "admin", "saved_clinics": [], "profile": {"dob":"1984-03-12","gender":"Female","country":"Nairobi","bloodType":"A+","allergies":"None","emergencyContact":"N/A"}},
        {"full_name": "Dr. Peter Karanja", "email": "peter.karanja@example.com", "phone_number": "+254711998877", "password": "123", "role": "admin", "saved_clinics": [], "profile": {"dob":"1978-07-22","gender":"Male","country":"Nairobi","bloodType":"O-","allergies":"None","emergencyContact":"N/A"}},
        {"full_name": "Erick Mwangi", "email": "erick.mwangi@example.com", "phone_number": "+254700987654", "password": "123", "role": "patient", "saved_clinics": ["3", "4"], "profile": {"dob":"1992-11-30","gender":"Male","country":"Nairobi","bloodType":"B-","allergies":"None","emergencyContact":"Jane Mwangi • +254733333333"}},
    ]

    # --- CLINICS ---
    clinics = [
        {"name":"Mombasa Community Health Center","location":"Nyali, Mombasa","coordinates":[-4.0435,39.6682],"services":["Maternity","HIV Testing","Nutrition","General","Lab Tests"],"rating":4.1,"reviews":55,"phone":"+254711987654","email":"mombasa@health.go.ke","doctors":["Dr. Amina Mohamed","Dr. Hassan Ali"],"operating_hours":[{"day":"Monday","open":"07:00","close":"19:00","closed":False},{"day":"Saturday","open":"08:00","close":"17:00","closed":False},{"day":"Sunday","closed":True}],"password":"clinic123"},
        {"name":"Nairobi Wellness Hospital","location":"Kilimani, Nairobi","coordinates":[-1.2921,36.8219],"services":["Cardiology","Orthopaedics","Physiotherapy","Lab Tests"],"rating":4.8,"reviews":104,"phone":"+254701223344","email":"info@nairobiwellness.co.ke","doctors":["Dr. Peter Karanja","Dr. Leah Chebet"],"operating_hours":[{"day":"Monday","open":"06:00","close":"20:00","closed":False}],"password":"clinic123"},
        {"name":"Eldoret Medical Center","location":"Eldoret, Uasin Gishu","coordinates":[0.5143,35.2696],"services":["General","Dental","Lab Tests"],"rating":4.3,"reviews":72,"phone":"+254700112233","email":"eldoret@medical.co.ke","doctors":["Dr. Peter Karanja"],"operating_hours":[{"day":"Monday","open":"08:00","close":"18:00","closed":False}],"password":"clinic123"}    
    ]

    # --- ARTICLES ---
    articles = [
        {"title":"Antenatal Care in Kenya: What to Expect During Your Pregnancy Journey","category":"Maternity","author":"Dr. Amina Mohamed","date":"2025-07-01","read_time":"6 min","image":"https://images.unsplash.com/photo-1541708873836-8c414d799d10","summary":"Antenatal care (ANC) is crucial for a healthy pregnancy and safe delivery.","content":"## Antenatal Care in Kenya: What to Expect\nAntenatal Care (ANC) is vital...","published":True,"is_trending":True},
        {"title":"Managing Hypertension in Kenya: Simple Steps for a Healthier Life","category":"Chronic Illness","author":"Dr. Peter Karanja","date":"2025-08-10","read_time":"8 min","image":"https://images.unsplash.com/photo-1606312619070-daa4f60e8c06","summary":"Hypertension affects nearly 1 in 4 Kenyan adults.","content":"### Understanding Hypertension\nHigh blood pressure...","published":True,"is_trending":False},
        {"title":"Mental Health Awareness in Kenya: Breaking the Stigma","category":"Mental Health","author":"Dr. Leah Chebet","date":"2025-09-05","read_time":"7 min","image":"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4","summary":"Mental health services in Kenya are improving.","content":"Kenya has made progress in recognizing mental health...","published":True,"is_trending":True},
        {"title":"Nutrition Tips for Busy Kenyans","category":"Nutrition","author":"Dr. Amina Mohamed","date":"2025-09-15","read_time":"5 min","image":"https://images.unsplash.com/photo-1576091176288-ad9d6573c9c6","summary":"Healthy eating tips for busy lifestyles.","content":"Eat plenty of vegetables...","published":True,"is_trending":False},
        {"title":"COVID-19 Updates and Safety Measures","category":"Public Health","author":"Dr. Peter Karanja","date":"2025-10-01","read_time":"4 min","image":"https://images.unsplash.com/photo-1584036561584-b03c19da874c","summary":"Latest COVID-19 updates in Kenya.","content":"Follow MOH guidelines...","published":True,"is_trending":True}
    ]

    # --- REPORTS ---
    reports = [
        {"title":"Monthly Clinic Performance - Nairobi Wellness","category":"Performance","author":"Admin User","date":"2025-10-01","summary":"Monthly stats for Nairobi Wellness","content":"Detailed stats..."},
        {"title":"Monthly Clinic Performance - Mombasa Community Health Center","category":"Performance","author":"Admin User","date":"2025-10-01","summary":"Monthly stats for Mombasa Community Health Center","content":"Detailed stats..."},
    ]

    # --- SAVE USERS ---
    for u in users:
        if not User.query.filter_by(email=u["email"]).first():
            user = User(
                full_name=u["full_name"],
                email=u["email"],
                phone_number=u.get("phone_number"),
                role=u["role"],
                clinic_id=None
            )
            user.set_password(u["password"])
            db.session.add(user)

    # --- SAVE CLINICS AND CLINIC USERS ---
    for c in clinics:
        clinic_record = Clinic(
            name=c["name"],
            location=c.get("location"),
            phone=c.get("phone"),
            email=c.get("email"),
            password=c["password"]
        )
        db.session.add(clinic_record)
        db.session.flush()  # ensure clinic_record.id exists

        # Create a User account for the clinic
        if not User.query.filter_by(email=c["email"]).first():
            clinic_user = User(
                full_name=c["name"],
                email=c["email"],
                phone_number=c.get("phone"),
                role="clinic",
                clinic_id=clinic_record.id
            )
            clinic_user.set_password(c["password"])
            db.session.add(clinic_user)

    # --- SAVE ARTICLES ---
    for a in articles:
        db.session.add(Article(**a))

    # --- SAVE REPORTS ---
    for r in reports:
        db.session.add(Report(**r))

    db.session.commit()
    print("Seeding complete!")
