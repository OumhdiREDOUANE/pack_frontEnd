import { getToken } from "./auth";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {

    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  credentials: "include"
  });

  try {
    const data = await res.json();

 
  if (!res.ok) {
    // هنا data.message غادي يكون "يجب تفعيل البريد الإلكتروني أولاً" أو أي رسالة أخرى
        throw new Error("Erreur lors du chargement des commandes");
  }




  return data

} catch (error) {
  return error
}

//   if (!res.ok) {
//     const message = data?.message || "Request failed";
//     const error = new Error(message);
//     error.status = res.status;
//     error.responseText = text;

//     throw error;
//   }


}

export async function apiRegister(payload) {
  return request("/api/register", { method: "POST", body: payload });
}

    export async function apiLogin(email, password) {
      return request("/api/login", { method: "POST", body: { email, password } });
    }

export async function resendVerificationEmail() {
  return request("/api/email/verification-notification", {
    method: "POST",
    auth: true,
  });
}

export async function getMe() {
  return request("/api/me", { method: "GET", auth: true });
}
