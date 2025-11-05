import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PackSpace Dashboard",
  description: "Complete project management dashboard",
  generator: "v0.app",
}

export default async function  RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
   const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  // إذا ما كاينش token، إعادة التوجيه مباشرة إلى login
  if (!token) {
    redirect("/login");
  }
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  // تحقق من token عبر API في Laravel
  try {
    const res = await fetch(`${API_BASE_URL}/api/check-admin`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store", // مهم باش يتجنب الكاش
    });

    if (!res.ok) {
      // token غير صالح أو ليس admin
      redirect("/login");
    }
  } catch (error) {
    redirect("/login");
    throw new Error("Erreur lors du chargement des commandes");
  }
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  ) 
}
