// src/services/clinicService.js

const mockClinics = [
  {
    id: 1,
    name: "Nairobi West Clinic",
    location: "Nairobi West, Lang'ata Rd",
    county: "Nairobi",
    lat: -1.3121,
    lng: 36.8129,
    contact: "+254 700 111 222",
    hours: {
      weekdays: "Mon-Fri 8AM-6PM",
      saturday: "Sat 9AM-1PM",
      sunday: "Sun: Closed",
    },
    services: ["General Consultation", "Vaccination", "Laboratory", "X-Ray"],
    doctors: [
      {
        name: "Dr. Aisha Mwangi",
        specialty: "General Practitioner",
        bio: "10+ years experience in family care.",
      },
      {
        name: "Dr. Peter Kariuki",
        specialty: "Pediatrician",
        bio: "Child health specialist.",
      },
    ],
    description:
      "Your trusted neighborhood clinic offering comprehensive healthcare services.",
    imageUrl:
      "https://placehold.co/800x500/10B981/white?text=Nairobi+West+Clinic",
  },
  {
    id: 2,
    name: "Mombasa Health Centre",
    location: "Moi Avenue",
    county: "Mombasa",
    lat: -4.0435,
    lng: 39.6682,
    contact: "+254 700 222 333",
    hours: {
      weekdays: "Mon-Fri 7AM-7PM",
      saturday: "Sat 8AM-4PM",
      sunday: "Sun: Emergency Only",
    },
    services: ["Dental Care", "Pediatrics", "Pharmacy", "Minor Surgery"],
    doctors: [
      {
        name: "Dr. Fatima Ali",
        specialty: "Dentist",
        bio: "Expert in oral health.",
      },
      {
        name: "Dr. James Otieno",
        specialty: "Surgeon",
        bio: "Minor procedures specialist.",
      },
    ],
    description:
      "Coastal healthcare excellence with modern facilities and experienced staff.",
    imageUrl:
      "https://placehold.co/800x500/0EA5E9/white?text=Mombasa+Health+Centre",
  },
  {
    id: 3,
    name: "Kisumu Family Clinic",
    location: "Oginga Odinga Street",
    county: "Kisumu",
    lat: -0.0917,
    lng: 34.7679,
    contact: "+254 700 333 444",
    hours: {
      weekdays: "Mon-Fri 8AM-5PM",
      saturday: "Sat 9AM-2PM",
      sunday: "Sun: Closed",
    },
    services: ["Outpatient", "Maternal Care", "Lab Testing", "Ultrasound"],
    doctors: [
      {
        name: "Dr. Sarah Chebet",
        specialty: "OB/GYN",
        bio: "Maternal and reproductive health.",
      },
      {
        name: "Dr. Moses Omondi",
        specialty: "Lab Technician",
        bio: "Accurate diagnostics.",
      },
    ],
    description:
      "Family-focused care with a personal touch in the heart of Kisumu.",
    imageUrl:
      "https://placehold.co/800x500/8B5CF6/white?text=Kisumu+Family+Clinic",
  },
];

// GET ALL CLINICS
export async function getClinics() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClinics), 300);
  });
}

// GET SINGLE CLINIC BY ID
export async function getClinicById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clinic = mockClinics.find((c) => c.id === id);
      if (clinic) {
        resolve(clinic);
      } else {
        reject(new Error("Clinic not found"));
      }
    }, 300);
  });
}

// BOOK APPOINTMENT
export const bookAppointment = async (data) => {
  await new Promise((r) => setTimeout(r, 800));

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const clinic = mockClinics.find((c) => c.id === data.clinicId);

  const newBooking = {
    id: Date.now(),
    ...data,
    status: "Upcoming",
    clinicName: clinic?.name || data.clinicName || "Unknown Clinic",
    doctorName: "Dr. Not Assigned",
    location: clinic?.location || "N/A",
    contact: clinic?.contact || "N/A",
  };

  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  return newBooking;
};
