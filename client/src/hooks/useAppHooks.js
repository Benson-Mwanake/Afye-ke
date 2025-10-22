// src/hooks/useAppHooks.js
import { useEffect, useState } from "react";
/* In-memory mock DB */
const now = () => new Date().toISOString();
const mockDB = {
  users: [
    {
      id: 1,
      full_name: "Grace Njeri",
      email: "grace@chv.ke",
      role: "chv",
      county: "Nairobi",
    },
    {
      id: 2,
      full_name: "Patient One",
      email: "patient1@example.com",
      role: "patient",
      county: "Kisumu",
    },
    {
      id: 3,
      full_name: "Admin User",
      email: "admin@afyalink.ke",
      role: "admin",
      county: "Nairobi",
    },
  ],
  patients: [
    {
      id: 1,
      name: "Mary Njeri",
      age: 27,
      county: "Nairobi",
      phone: "+254700111111",
      lastVisit: "2025-10-15",
      condition: "Hypertension",
      assigned_chv_id: 1,
    },
    {
      id: 2,
      name: "John Otieno",
      age: 34,
      county: "Kisumu",
      phone: "+254700222222",
      lastVisit: "2025-10-12",
      condition: "Diabetes",
      assigned_chv_id: 1,
    },
    {
      id: 3,
      name: "Lucy Wambui",
      age: 41,
      county: "Nyeri",
      phone: "+254700333333",
      lastVisit: "2025-10-09",
      condition: "COPD",
      assigned_chv_id: 1,
    },
    {
      id: 4,
      name: "Peter Kamau",
      age: 22,
      county: "Nairobi",
      phone: "+254700444444",
      lastVisit: "2025-10-04",
      condition: "Malaria",
      assigned_chv_id: 1,
    },
  ],
  appointments: [
    {
      id: 1,
      patient_id: 1,
      patient_name: "Mary Njeri",
      time: "09:30",
      date: "2025-10-20",
      type: "Follow-up",
      status: "confirmed",
      chv_id: 1,
    },
    {
      id: 2,
      patient_id: 2,
      patient_name: "John Otieno",
      time: "11:00",
      date: "2025-10-20",
      type: "Check-up",
      status: "pending",
      chv_id: 1,
    },
    {
      id: 3,
      patient_id: 3,
      patient_name: "Lucy Wambui",
      time: "14:00",
      date: "2025-10-21",
      type: "Referral",
      status: "pending",
      chv_id: 1,
    },
  ],
  reports: [
    {
      id: 1,
      patient_id: 3,
      patient_name: "Lucy Wambui",
      summary: "Reported chest pain, advised urgent review",
      date: "2025-10-17",
      chv_id: 1,
    },
  ],
};

/* helper */
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

/* useAuth*/
export const useAuth = (() => {
  let subscribers = [];
  let state = {
    token: localStorage.getItem("afyalink_token") || null,
    user: (() => {
      try {
        return JSON.parse(localStorage.getItem("afyalink_user"));
      } catch {
        return null;
      }
    })(),
  };

  function notify() {
    subscribers.forEach((s) => s({ ...state }));
  }

  function subscribe(setter) {
    subscribers.push(setter);
    setter({ ...state });
    return () => {
      subscribers = subscribers.filter((s) => s !== setter);
    };
  }

  // hook
  return function useAuthHook() {
    const [internal, setInternal] = useState({ ...state, loading: false });

    useEffect(() => subscribe(setInternal), []);

    const login = async ({ email, password }) => {
      setInternal((i) => ({ ...i, loading: true }));
      await delay(500);

      const user = mockDB.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!user) {
        setInternal((i) => ({ ...i, loading: false }));
        return { ok: false, error: "User not found (mock)" };
      }

      const token = `mock-jwt-token.${user.id}.${Date.now()}`;
      state.token = token;
      state.user = user;
      localStorage.setItem("afyalink_token", token);
      localStorage.setItem("afyalink_user", JSON.stringify(user));
      notify();
      setInternal((i) => ({ ...i, loading: false }));
      return { ok: true, user, token };
    };

    const register = async (payload) => {
      setInternal((i) => ({ ...i, loading: true }));
      await delay(600);
      const id = mockDB.users.length + 1;
      const newUser = { id, ...payload };
      mockDB.users.push(newUser);
      setInternal((i) => ({ ...i, loading: false }));
      return { ok: true, user: newUser };
    };

    const logout = () => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("afyalink_token");
      localStorage.removeItem("afyalink_user");
      notify();
    };

    const refreshUser = (u) => {
      state.user = u;
      localStorage.setItem("afyalink_user", JSON.stringify(u));
      notify();
    };

    return {
      user: internal.user,
      token: internal.token,
      loading: internal.loading,
      login,
      register,
      logout,
      refreshUser,
      isAuthenticated: !!internal.token,
    };
  };
})();


export function useFetch() {
  const get = async (path, opts = {}) => {
    await delay(350);
    const [p, qs] = path.split("?");
    const params = {};
    if (qs) {
      qs.split("&").forEach((q) => {
        const [k, v] = q.split("=");
        params[k] = decodeURIComponent(v || "");
      });
    }

    // Routes
    if (p === "/chv/patients") {
      const chv_id = params.chv_id ? Number(params.chv_id) : null;
      let list = [...mockDB.patients];
      if (chv_id) list = list.filter((pt) => pt.assigned_chv_id === chv_id);
      return { ok: true, data: list };
    }

    if (p === "/chv/appointments") {
      const chv_id = params.chv_id ? Number(params.chv_id) : null;
      let list = [...mockDB.appointments];
      if (chv_id) list = list.filter((a) => a.chv_id === chv_id);
      // sort by date/time
      list.sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1));
      return { ok: true, data: list };
    }

    if (p === "/chv/reports") {
      const chv_id = params.chv_id ? Number(params.chv_id) : null;
      let list = [...mockDB.reports];
      if (chv_id) list = list.filter((r) => r.chv_id === chv_id);
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      return { ok: true, data: list };
    }

    if (p === "/clinic/stats") {
      //charts
      const patientsPerCounty = mockDB.patients.reduce((acc, p) => {
        acc[p.county] = (acc[p.county] || 0) + 1;
        return acc;
      }, {});
      const chartData = Object.entries(patientsPerCounty).map(
        ([county, value]) => ({ county, value })
      );
      return { ok: true, data: { chartData } };
    }

    return { ok: false, error: "Not found (mock)" };
  };

  const post = async (path, body) => {
    await delay(400);
    if (path === "/chv/reports") {
      const id = mockDB.reports.length + 1;
      const rec = {
        id,
        patient_id: body.patient_id || null,
        patient_name: body.patient_name || body.patient || "Unknown",
        summary: body.summary || body.notes || "No summary",
        date: body.date || now().slice(0, 10),
        chv_id: body.chv_id || 1,
      };
      mockDB.reports.unshift(rec);
      return { ok: true, data: rec };
    }

    if (path === "/chv/appointments") {
      const id = mockDB.appointments.length + 1;
      const rec = {
        id,
        patient_id: body.patient_id || null,
        patient_name: body.patient_name || body.patient || "Unknown",
        date: body.date || now().slice(0, 10),
        time: body.time || "09:00",
        type: body.type || "Check-up",
        status: body.status || "pending",
        chv_id: body.chv_id || 1,
      };
      mockDB.appointments.push(rec);
      return { ok: true, data: rec };
    }

    return { ok: false, error: "Not found (mock)" };
  };

  const patch = async (path, body) => {
    await delay(200);
    const m = path.match(/\/appointments\/(\d+)/);
    if (m) {
      const id = Number(m[1]);
      const idx = mockDB.appointments.findIndex((a) => a.id === id);
      if (idx === -1) return { ok: false, error: "Not found" };
      mockDB.appointments[idx] = { ...mockDB.appointments[idx], ...body };
      return { ok: true, data: mockDB.appointments[idx] };
    }
    return { ok: false, error: "Not found" };
  };

  return { get, post, patch, _mockDB: mockDB };
}

/* useProtectedRoute */
export function useProtectedRoute() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("afyalink_token");
    setIsAuth(!!token);
  }, []);
  return isAuth;
}

/*useCloudinary*/
export function useCloudinary() {
  const uploadImage = async (file) => {
    await delay(600);
    const name = file?.name ? file.name.replace(/\s+/g, "_") : "upload";
    const url = `https://res.cloudinary.com/demo/image/upload/v${Date.now()}/${name}`;
    return { secure_url: url, public_id: `mock_${Date.now()}` };
  };
  return { uploadImage };
}

/*useSendGrid */
export function useSendGrid() {
  const sendEmail = async ({ to, subject, html }) => {
    await delay(300);
    console.info("[mock sendgrid] to:", to, "subject:", subject);
    if (!to) {
      return { ok: false, error: "Missing recipient (mock)" };
    }
    return { ok: true, result: { id: `msg_${Date.now()}` } };
  };
  return { sendEmail };
}
