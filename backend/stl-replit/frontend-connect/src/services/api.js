import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("ehb_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => API.post("/auth/login", { email, password });
export const signup = (payload) => API.post("/auth/signup", payload);
export const getSTL = (id) => API.get(`/stl/${id}`);
export const askAI = (message, userId) => API.post("/chat", { message, userId });
export const runAIAnalysis = (id) => API.get(`/ai/${id}`);
export const completeTask = (id) => API.post(`/task/${id}`);

export const saveSession = (token, user) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("ehb_token", token);
  window.localStorage.setItem("ehb_user", JSON.stringify(user || {}));
};

export const getSessionUser = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("ehb_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("ehb_token");
  window.localStorage.removeItem("ehb_user");
};

