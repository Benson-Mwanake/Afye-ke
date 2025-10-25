import { API_URL } from "../context/AuthContext";
import { BriefcaseMedical, ClipboardList, Users } from "lucide-react";

export const adminService = {
  getUsers: async () => {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },
  getClinics: async () => {
    const res = await fetch(`${API_URL}/clinics`);
    if (!res.ok) throw new Error("Failed to fetch clinics");
    return res.json();
  },
  getAppointments: async () => {
    const res = await fetch(`${API_URL}/appointments`);
    if (!res.ok) throw new Error("Failed to fetch appointments");
    return res.json();
  },
  getRecentActivity: async () => {
    // Mock activity for now, as db.json doesn't have an activity endpoint
    return [
      {
        type: "New clinic registration",
        description: "Kisumu Medical Centre",
        time: "2 hours ago",
        icon: BriefcaseMedical,
        status: "pending",
      },
      {
        type: "Article published",
        description: "Understanding Malaria Prevention",
        time: "5 hours ago",
        icon: ClipboardList,
        status: "published",
      },
      {
        type: "Clinic approved",
        description: "Nakuru Health Center",
        time: "1 day ago",
        icon: BriefcaseMedical,
        status: "approved",
      },
      {
        type: "45 new users",
        description: "User signups",
        time: "1 day ago",
        icon: Users,
        status: "active",
      },
    ];
  },
};
