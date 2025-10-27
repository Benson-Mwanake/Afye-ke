from app import create_app
from extensions import db
from models import User, Clinic, Booking, CHV, Article
from datetime import datetime, timedelta
import random
import slugify  # optional: pip install python-slugify
# if slugify not available, simple replace

app = create_app()
app.app_context().push()

def simple_slug(title):
    return title.lower().replace(" ", "-")

db.drop_all()
db.create_all()

# Create users
user_names = [
    ("Jesse Mwangi", "jesse@example.com"),
    ("Aisha Wanjiru", "aisha@example.com"),
    ("Samuel Otieno", "samuel@example.com"),
    ("Grace Njeri", "grace@example.com"),
    ("Peter Kamau", "peter@example.com"),
]

users = []
for name, email in user_names:
    u = User(full_name=name, email=email)
    u.set_password("password123")
    db.session.add(u)
    users.append(u)
db.session.commit()

# Clinics (Kenyan counties + sample GPS)
clinic_list = [
    ("Nyali Health Centre", "Mombasa", "Nyali, Mombasa", "0712345678", -4.0500, 39.6500, "General,Maternal,Child Health"),
    ("Machakos County Hospital", "Machakos", "Machakos Town", "0723456789", -1.5110, 37.2610, "Surgery,OPD,Pharmacy"),
    ("Kibera Community Clinic", "Nairobi", "Kibera, Nairobi", "0734567890", -1.3138, 36.8219, "OPD,Immunization"),
    ("Kisumu Family Health", "Kisumu", "Kisumu CBD", "0709876543", -0.0917, 34.7679, "Maternity,Lab"),
    ("Nyeri County Clinic", "Nyeri", "Nyeri Town", "0798765432", -0.4167, 36.9500, "OPD,Pharmacy"),
]

clinics = []
for name, county, address, phone, lat, lng, services in clinic_list:
    c = Clinic(name=name, county=county, address=address, phone=phone, lat=lat, lng=lng, services=services)
    db.session.add(c)
    clinics.append(c)
db.session.commit()

# CHVs (Community Health Volunteers)
chv_list = [
    ("Mama Amina Otieno","0721111111","Nairobi"),
    ("John Mwenda","0722222222","Mombasa"),
    ("Esther Wairimu","0723333333","Kisumu"),
    ("Peter Njoroge","0724444444","Nyeri"),
    ("Mercy Atieno","0725555555","Machakos"),
]
chvs = []
for name, phone, county in chv_list:
    assigned = random.choice(clinics)
    chv = CHV(full_name=name, phone=phone, county=county, clinic=assigned,
              bio=f"{name} is a trusted CHV serving the {county} community with maternal and child health outreach.")
    db.session.add(chv)
    chvs.append(chv)
db.session.commit()

# Bookings (some seeded)
for i in range(8):
    u = random.choice(users)
    c = random.choice(clinics)
    appt = datetime.utcnow() + timedelta(days=random.randint(1,30))
    b = Booking(user_id=u.id, clinic_id=c.id, appointment_time=appt, status=random.choice(["pending","confirmed"]))
    db.session.add(b)
db.session.commit()

# Long health education articles (Kenyan oriented)
articles = [
    {
        "title":"Preventing Malaria in Your Community",
        "author":"Ministry of Health",
        "content":(
            "Malaria remains a major public health concern in many parts of Kenya. "
            "Prevention includes sleeping under long-lasting insecticide-treated nets (LLINs), "
            "indoor residual spraying (IRS) where recommended, prompt diagnosis and treatment, "
            "draining standing water around homes to reduce mosquito breeding sites, and seeking "
            "prenatal care for pregnant women. Communities should also be empowered through "
            "education campaigns about symptom recognition and the importance of early treatment. "
            "If you or a family member have fever, chills, headache or joint pain seek testing immediately. "
            "Children, pregnant women and the elderly are especially vulnerable so prioritize preventive strategies for them."
        )
    },
    {
        "title":"Maternal Health: What Every Mother Should Know",
        "author":"Kenya Maternal Health Initiative",
        "content":(
            "A healthy pregnancy starts with early antenatal care (ANC). Expectant mothers should attend at least four ANC visits "
            "throughout the pregnancy to monitor the health of mother and baby, receive tetanus toxoid vaccinations where indicated, "
            "and get counselling on nutrition, danger signs, and birth preparedness. Skilled birth attendance significantly reduces "
            "maternal and neonatal deaths. Recognize danger signs such as severe bleeding, severe headache, blurred vision, and reduced fetal movements "
            "and seek immediate care. Postnatal care within 48 hours, plus follow-ups at 1-2 weeks and 6 weeks, ensures both mother and infant receive essential care."
        )
    },
    {
        "title":"Nutrition for Children under 5",
        "author":"Community Health Services",
        "content":(
            "Good nutrition in the first 1000 days (from conception to 2 years) is crucial. Exclusive breastfeeding for the first 6 months, "
            "followed by appropriate complementary feeding and continued breastfeeding, helps child growth and immunity. Offer diverse foods "
            "including legumes, vegetables, fruits and animal-source foods if available. Monitor growth at health clinics, and seek advice if "
            "a child is not gaining weight. Vitamin A supplementation and deworming are part of routine child health services in many counties."
        )
    }
]

for a in articles:
    slug = simple_slug(a["title"])
    article = Article(title=a["title"], slug=slug, content=a["content"], author=a["author"])
    db.session.add(article)
db.session.commit()

print("Seeding complete.")
