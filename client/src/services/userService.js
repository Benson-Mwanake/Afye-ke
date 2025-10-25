// src/services/userService.js
import usersData from "../data/users.json";

let users = [...usersData];

const mockAppointments = {
  "john.doe@example.com": [
    {
      id: 1,
      clinicName: "Nairobi Health Center",
      location: "Westlands, Nairobi",
      doctorName: "Dr. Jane Mwangi",
      service: "General",
      date: "2025-10-25",
      time: "10:00 AM",
    },
    {
      id: 2,
      clinicName: "Westlands Medical Clinic",
      location: "Westlands, Nairobi",
      doctorName: "Dr. Peter Kariuki",
      service: "Follow Up",
      date: "2025-10-27",
      time: "2:30 PM",
    },
  ],
};

export const getUsers = () => {
  return users;
};

export const addUser = (newUser) => {
  const existingUser = users.find((u) => u.email === newUser.email);
  if (existingUser) {
    return false;
  }
  users = [...users, newUser];
  console.log("Mock data updated (to be synced manually):", users);
  return true;
};

export const findUser = (email, password) => {
  return users.find((u) => u.email === email && u.password === password);
};

// services/userService.js
export const fetchAppointments = async (email) => {
  await new Promise((r) => setTimeout(r, 500)); // Mock delay
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  // Filter by user email (optional)
  return bookings.filter(b => b.name.toLowerCase().includes(email.toLowerCase()) || true);
};