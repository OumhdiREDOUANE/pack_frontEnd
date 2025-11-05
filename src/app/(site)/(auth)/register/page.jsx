"use client";

import { useState } from "react";
import { apiRegister } from "src/app/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomComplet: "",
    numero_telephone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);

    try {
      const { message } = await apiRegister(form);
      setMsg(message);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "nomComplet", label: "Nom complet" },
    { name: "numero_telephone", label: "Numéro de téléphone" },
    { name: "email", label: "Adresse e-mail" },
    { name: "password", label: "Mot de passe" },
    { name: "password_confirmation", label: "Confirmer le mot de passe" },
  ];

  const formFieldClasses =
    "w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-[#C09200] text-gray-700 placeholder-gray-400 focus:outline-none transition text-base sm:text-lg font-normal leading-relaxed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center leading-tight">
          Créer un compte
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 leading-relaxed">
                {field.label}
              </label>
              <input
                type={field.name.includes("password") ? "password" : "text"}
                name={field.name}
                value={form[field.name]}
                onChange={onChange}
                required
                className={formFieldClasses + (field.name.includes("email") ? " text-[#6071e5]" : "")}
              />
            </div>
          ))}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm sm:text-base text-center leading-relaxed">
              {error}
            </div>
          )}

          {msg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm sm:text-base text-center leading-relaxed">
              {msg}
            </div>
          )}

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
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-gray-500 mt-4 leading-relaxed">
          Vous avez déjà un compte ?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#6071e5] font-medium cursor-pointer hover:underline"
          >
            Connectez-vous
          </span>
        </p>
      </div>
    </div>
  );
}
