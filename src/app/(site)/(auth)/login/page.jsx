"use client";

import { useState, useEffect } from "react";
import { apiLogin, resendVerificationEmail } from "src/app/lib/api";
import { useAuth } from "src/app/components/AuthProvider";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const verifyUrl = searchParams.get("verifyUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (verifyUrl) {
      const backendUrl = API_BASE_URL + verifyUrl;
      fetch(backendUrl, { method: "GET", credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Votre e-mail a été vérifié avec succès !");
        });
    }
  }, [verifyUrl]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const response = await apiLogin(email, password);

      if (response.message && !response.user) {
        setError("Erreur lors du chargement des commandes");
        setLoading(false);
        return;
      }

      if (response.token) {
        Cookies.set("token", response.token);
        login(response.token);
      }

      if (response.user.role === "admin") {
        router.push("/home");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Une erreur inconnue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 sm:p-10">
        {/* العنوان الرئيسي */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center leading-tight">
          Connexion
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 leading-relaxed">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[#C09200] text-[#6071e5] focus:outline-none transition text-base sm:text-lg font-normal leading-relaxed"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 leading-relaxed">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[#C09200] text-[#6071e5] focus:outline-none transition text-base sm:text-lg font-normal leading-relaxed"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm sm:text-base text-center leading-relaxed">
              {error}
              {error.includes("activer votre e-mail") && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await resendVerificationEmail();
                      setInfo(
                        "Un e-mail de vérification a été renvoyé sur votre boîte."
                      );
                    } catch (e) {
                      setError(e.message);
                    }
                  }}
                  className="underline block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Renvoyer le lien de vérification
                </button>
              )}
            </div>
          )}

          {/* Info */}
          {info && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm sm:text-base text-center leading-relaxed">
              {info}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#006294] hover:bg-[#C09200] text-white font-semibold text-lg sm:text-xl transition flex items-center justify-center disabled:opacity-50"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-gray-500 mt-4 leading-relaxed">
          Pas de compte ?{" "}
          <Link
            href="/register"
            className="text-[#6071e5] font-medium cursor-pointer hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
