from app import create_app
from extensions import db
from models import User, Clinic, Article, Appointment, Report, Review
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    print("Seeding database...")

    # --- USERS ---
    users = [
        {"full_name": "John Doe", "email": "john.doe@example.com", "phone_number": "+254712345678", "password": "123", "role": "patient"},
        {"full_name": "Faith Wanjiku", "email": "faith.wanjiku@example.com", "phone_number": "+254711223344", "password": "123", "role": "patient"},
        {"full_name": "Admin User", "email": "admin@example.com", "phone_number": "+254700000000", "password": "admin123", "role": "admin"},
        {"full_name": "Alice Mwende", "email": "alice.mwende@example.com", "phone_number": "+254700123456", "password": "123", "role": "patient"},
        {"full_name": "Bob Otieno", "email": "bob.otieno@example.com", "phone_number": "+254700654321", "password": "123", "role": "patient"},
        {"full_name": "Dr. Amina Mohamed", "email": "amina.mohamed@example.com", "phone_number": "+254722334455", "password": "123", "role": "admin"},
        {"full_name": "Dr. Peter Karanja", "email": "peter.karanja@example.com", "phone_number": "+254711998877", "password": "123", "role": "admin"},
        {"full_name": "Dr. Leah Chebet", "email": "leah.chebet@example.com", "phone_number": "+254733445566", "password": "123", "role": "admin"},
        {"full_name": "Erick Mwangi", "email": "erick.mwangi@example.com", "phone_number": "+254700987654", "password": "123", "role": "patient"},
    ]

    # --- CLINICS ---
    clinics = [
        {
            "name": "Mombasa Community Health Center",
            "location": "Nyali, Mombasa",
            "phone": "+254711987654",
            "email": "mombasa@health.go.ke",
            "password": "clinic123",
            "opening_time": "08:00 AM",
            "closing_time": "05:00 PM",
            "services": ["General Checkup", "Vaccination", "Blood Test", "Follow-up Visit"]
        },
        {
            "name": "Nairobi Wellness Hospital",
            "location": "Kilimani, Nairobi",
            "phone": "+254701223344",
            "email": "info@nairobiwellness.co.ke",
            "password": "clinic123",
            "opening_time": "08:00 AM",
            "closing_time": "06:00 PM",
            "services": ["General Checkup", "Antenatal Checkup", "Nutrition Counseling", "Mental Health Consultation"]
        },
        {
            "name": "Eldoret Medical Center",
            "location": "Eldoret, Uasin Gishu",
            "phone": "+254700112233",
            "email": "eldoret@medical.co.ke",
            "password": "clinic123",
            "opening_time": "08:30 AM",
            "closing_time": "05:30 PM",
            "services": ["Dental Checkup", "General Checkup", "Blood Test", "Vaccination"]
        },
        {
            "name": "Kisumu Lakeside Hospital",
            "location": "Milimani, Kisumu",
            "phone": "+254713334455",
            "email": "kisumu@lakeside.co.ke",
            "password": "clinic123",
            "opening_time": "09:00 AM",
            "closing_time": "05:00 PM",
            "services": ["General Checkup", "Follow-up Visit", "Nutrition Counseling"]
        },
        {
            "name": "Makadara Health Centre",
            "location": "Makadara, Nairobi",
            "phone": "+25470011343",
            "email": "madaraka@medical.co.ke",
            "password": "clinic123",
            "opening_time": "08:00 AM",
            "closing_time": "04:30 PM",
            "services": ["General Checkup", "Vaccination", "Blood Test"]
        },
    ]

    # --- ARTICLES ---
    articles = [
        {"title":"Antenatal Care in Kenya: What to Expect During Your Pregnancy Journey","category":"Maternity","author":"Dr. Amina Mohamed","date":"2025-07-01","read_time":"6 min","image":"https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJlZ25hbmN5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500","summary":"Antenatal care (ANC) is crucial for a healthy pregnancy and safe delivery.","content":"Antenatal care (ANC) in Kenya is a vital part of every woman’s pregnancy journey, ensuring both mother and baby remain healthy throughout the nine months. The Ministry of Health recommends that expectant mothers attend at least eight antenatal visits, starting as early as the first trimester, to monitor fetal growth, detect potential complications, and receive essential health education. During your visits, healthcare providers will check your blood pressure, weight, and baby’s heartbeat, as well as conduct routine lab tests such as blood grouping, HIV and syphilis screening, and hemoglobin levels. Expect to receive important supplements like iron, folic acid, and sometimes malaria prophylaxis if you live in high-risk areas. You’ll also get guidance on proper nutrition, safe exercises, emotional well-being, and birth preparedness, including choosing a skilled birth attendant and planning for delivery. Fathers and partners are encouraged to participate in ANC sessions to support the mother emotionally and practically. In Kenya, most public hospitals, health centers, and private clinics offer antenatal care services, often free or subsidized under the Linda Mama program. Regular attendance and open communication with your healthcare provider will help ensure a safe pregnancy, timely detection of risks, and a positive childbirth experience for both mother and baby.","published":True,"is_trending":True},
        {"title":"Managing Hypertension in Kenya: Simple Steps for a Healthier Life","category":"Chronic Illness","author":"Dr. Peter Karanja","date":"2025-08-10","read_time":"8 min","image":"https://plus.unsplash.com/premium_photo-1673958771843-12c73b278bd0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aHlwZXJ0ZW5zaW9ufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500","summary":"Managing hypertension in Kenya requires simple, consistent lifestyle choices combined with proper medical care to prevent serious complications like stroke, kidney failure, and heart disease. High blood pressure often develops silently, so regular screening at local clinics, pharmacies, or community health drives is essential for early detection. Once diagnosed, patients should take prescribed medication daily without skipping doses and follow up regularly with healthcare providers for blood pressure monitoring. A balanced diet rich in fruits, vegetables, and whole grains—while reducing salt, processed foods, and sugary drinks—helps maintain healthy pressure levels. Regular physical activity such as brisk walking, cycling, or swimming for at least 30 minutes most days can significantly lower blood pressure. Managing stress through rest, deep breathing, and relaxation activities, as well as avoiding smoking and limiting alcohol intake, are equally important. Kenya’s Ministry of Health encourages lifestyle-based management alongside medical treatment, with community health volunteers offering support and education across counties. By staying informed, adhering to medication, and making daily healthy choices, Kenyans living with hypertension can lead active, fulfilling lives and greatly reduce the risk of life-threatening complications.","content":"### Understanding Hypertension\nHigh blood pressure...","published":True,"is_trending":False},
        {"title":"Mental Health Awareness in Kenya: Breaking the Stigma","category":"Mental Health","author":"Dr. Leah Chebet","date":"2025-09-05","read_time":"7 min","image":"https://images.unsplash.com/photo-1604480132736-44c188fe4d20?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVudGFsJTIwaGVhbHRofGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500","summary":"Mental health awareness in Kenya has gained growing attention in recent years as communities, health professionals, and policymakers work together to break the stigma surrounding mental illness. Many Kenyans still face barriers such as misinformation, cultural taboos, and limited access to qualified mental health services, leading to silent suffering among people living with conditions like depression, anxiety, and bipolar disorder. The government, through the Ministry of Health and the Mental Health Policy 2021–2030, is prioritizing mental well-being as an essential part of overall health, promoting community-based interventions and integrating mental health care into primary health facilities. Individuals are encouraged to seek help early, talk openly about their feelings, and support friends or family members who may be struggling. Counseling services, support groups, and hotlines such as those provided by Chiromo Hospital Group, Befrienders Kenya, and other local organizations are increasingly available and confidential. Breaking the stigma starts with awareness, empathy, and education—understanding that mental health challenges are medical conditions, not personal weaknesses. By fostering open conversations, supporting professional care, and promoting self-care practices like mindfulness, exercise, and rest, Kenyans can build a healthier society where everyone feels safe to seek help and thrive mentally and emotionally.","published":True,"is_trending":True},
        {"title":"Nutrition Tips for Busy Kenyans","category":"Nutrition","author":"Dr. Amina Mohamed","date":"2025-09-15","read_time":"5 min","image":"https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG51dHJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500","summary":"Healthy eating tips for busy lifestyles.","content":"Good nutrition is essential for maintaining energy, focus, and long-term health, especially for busy Kenyans balancing work, school, and family life. Even with a tight schedule, simple daily habits can make a big difference. Start your day with a balanced breakfast rich in whole grains, fruits, and proteins like eggs or beans to fuel your morning. During the day, opt for locally available healthy meals such as ugali with sukuma wiki, githeri, or grilled fish instead of fried or heavily processed foods. Keep hydrated by drinking enough water and limiting sugary sodas or energy drinks. For snacks, choose fruits, nuts, or roasted maize over chips or pastries. Meal planning over the weekend can help you prepare healthy options in advance, saving both time and money. Reducing salt, sugar, and oily foods while increasing vegetables and lean proteins supports heart health and helps manage weight. Finally, avoid skipping meals—small, regular portions keep your metabolism active and prevent overeating later. By making small, consistent changes and using fresh Kenyan ingredients, you can maintain a balanced diet that supports your busy lifestyle and overall well-being.","published":True,"is_trending":False},
        {"title":"COVID-19 Updates and Safety Measures","category":"Public Health","author":"Dr. Peter Karanja","date":"2025-10-01","read_time":"4 min","image":"https://plus.unsplash.com/premium_photo-1661603901299-c8554e8b8678?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y292aWQlMjAxOXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500","summary":"Latest COVID-19 updates in Kenya.","content":"In October 2025, the World Health Organization (WHO) reported about 159,103 new confirmed COVID-19 cases worldwide across 84 countries, along with 10,717 hospitalisations and 427 ICU admissions during the 28-day period from 15 September to 12 October. Although the global emergency phase ended in May 2023, COVID-19 continues to circulate, especially with variants like XFG (81 %) and NB.1.8.1 (12 %) dominating recent data. Updated vaccines for the 2025-26 season are available, and while some regions use a shared decision-making approach instead of universal rollout, vaccination remains the best protection against severe illness and hospitalisation. WHO and health experts continue to recommend basic safety measures: washing hands frequently, wearing well-fitted masks in crowded or poorly ventilated spaces, improving ventilation by opening windows, and staying home when feeling unwell until symptom-free for at least 24 hours. Vulnerable groups such as older adults, people with chronic diseases, or weakened immunity should be protected with extra caution. Anyone testing positive and at risk should consult a medical provider, as antiviral treatments may be available. For Kenya, including coastal areas like Mombasa, maintaining good hygiene, masking on public transport, and staying updated through local Ministry of Health advisories are key as respiratory infections tend to rise seasonally. The virus’s persistence highlights the importance of prevention and awareness, especially in travel-linked locations like Nyali. Reliable sources for further information include WHO (who.int), the CDC (cdc.gov), and Kenya’s Ministry of Health portals.","published":True,"is_trending":True}
    ]

    # --- REPORTS ---
    reports = [
        {"title": "Monthly Clinic Performance - Nairobi Wellness","category": "Performance","author": "Admin User","date": "2025-10-01","summary": "Monthly stats for Nairobi Wellness","content": "Detailed stats..."},
        {"title": "Monthly Clinic Performance - Mombasa Community Health Center","category": "Performance","author": "Admin User","date": "2025-10-01","summary": "Monthly stats for Mombasa Community Health Center","content": "Detailed stats..."},
    ]

    # --- SEED USERS ---
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
                opening_time=c.get("opening_time"),
                closing_time=c.get("closing_time"),
                services=c.get("services", [])
            )
            db.session.add(clinic)
            db.session.flush()

            # Create clinic user if not exists
            if not User.query.filter_by(email=c["email"]).first():
                clinic_user = User(
                    full_name=c["name"],
                    email=c["email"],
                    phone_number=c["phone"],
                    role="clinic",
                    clinic_id=clinic.id
                )
                clinic_user.set_password(c["password"])
                db.session.add(clinic_user)

    # --- SEED ARTICLES ---
    for a in articles:
        if not Article.query.filter_by(title=a["title"]).first():
            db.session.add(Article(**a))

    # --- SEED REPORTS ---
    for r in reports:
        if not Report.query.filter_by(title=r["title"]).first():
            db.session.add(Report(**r))

    # --- SEED REVIEWS ---
    if Review.query.count() == 0:
        reviews = [
            Review(clinic_id=1, user_id=1, rating=4.5, comment="Very professional and clean."),
            Review(clinic_id=2, user_id=2, rating=5.0, comment="Loved the service!"),
            Review(clinic_id=4, user_id=1, rating=4.2, comment="Fast emergency response."),
        ]
        db.session.add_all(reviews)

    # --- SEED DYNAMIC APPOINTMENTS ---
    if Appointment.query.count() == 0:
        patients = User.query.filter(User.role=="patient").all()
        clinics_list = Clinic.query.all()
        doctors = User.query.filter(User.role=="admin").filter(User.full_name.like("Dr.%")).all()

        services_pool = [
            "General Checkup",
            "Antenatal Checkup",
            "Mental Health Consultation",
            "Nutrition Counseling",
            "Vaccination",
            "Blood Test",
            "Follow-up Visit",
            "Dental Checkup"
        ]

        appointments = []
        start_date = datetime(2025, 11, 1)

        for patient in patients:
            for _ in range(random.randint(2,3)):
                clinic = random.choice(clinics_list)
                appointment_date = start_date + timedelta(days=random.randint(0,30))
                appointment_time = datetime.strptime(f"{random.randint(8,16)}:{random.choice(['00','30'])}", "%H:%M").time()
                doctor_name = random.choice(doctors).full_name if doctors else "Dr. Not Assigned"
                service = random.choice(clinic.services) if clinic.services else random.choice(services_pool)

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
                        notes="Auto-generated appointment for testing"
                    )
                )
        db.session.add_all(appointments)
        print(f" Seeded {len(appointments)} dynamic appointments for {len(patients)} patients.")

    db.session.commit()
    print("Seeding complete — everything inserted with no duplicates.")
