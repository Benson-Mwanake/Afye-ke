// src/services/clinicService.js

const mockClinics = [
  {
    id: 1,
    name: "Nairobi West Clinic",
    location: "Nairobi West, Lang'ata Rd",
    county: "Nairobi",
    lat: -1.3121,
    lng: 36.8129,
    services: ["General Consultation", "Vaccination", "Laboratory"],
  },
  {
    id: 2,
    name: "Mombasa Health Centre",
    location: "Moi Avenue",
    county: "Mombasa",
    lat: -4.0435,
    lng: 39.6682,
    services: ["Dental Care", "Pediatrics", "Pharmacy"],
  },
  {
    id: 3,
    name: "Kisumu Family Clinic",
    location: "Oginga Odinga Street",
    county: "Kisumu",
    lat: -0.0917,
    lng: 34.7679,
    services: ["Outpatient", "Maternal Care", "Lab Testing"],
  },
];

export async function getClinics() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClinics), 300);
  });
}

export async function getClinicById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClinics.find((c) => c.id === id)), 300);
  });
}

export async function bookAppointment(data) {
  console.log("Booking appointment:", data);
  // Simulate success
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ success: true, message: "Appointment booked!" }),
      500
    );
  });
}
