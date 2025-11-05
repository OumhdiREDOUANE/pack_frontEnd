"use client"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react";
import { Phone, Mail, MessageCircle, Sparkles, Star } from "lucide-react"

export function ContactSection() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
  const [settings, setSettings] = useState({
    contact_phone: "",
    contact_whatsapp: "",
    contact_email: ""
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/setting`)
        const data = await res.json()
        setSettings(data)
      } catch {
        console.error("Erreur lors du chargement des paramètres")
      }
    }
    fetchSettings()
  }, [])

  const contactMethods = [
    {
      icon: Phone,
      title: "par Téléphone",
      subtitle: "Du Lundi au Vendredi de 9h à 18h",
      contact: settings.contact_phone,
      color: "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600",
      glowColor: "shadow-amber-500/30",
    },
    {
      icon: Mail,
      title: "par Email",
      subtitle: "7jours/7 - 24h/24",
      contact: settings.contact_email,
      color: "bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600",
      glowColor: "shadow-rose-500/30",
    },
    {
      icon: MessageCircle,
      title: "par WhatsApp",
      subtitle: "Du Lundi au Vendredi de 9h à 18h",
      contact: settings.contact_whatsapp,
      color: "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600",
      glowColor: "shadow-emerald-500/30",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-card/50 relative overflow-hidden font-sans">
      <div className="container mx-auto px-4 py-20 max-w-6xl relative z-5">
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-4xl font-bold text-[#006294] mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-4xl mx-auto mb-6">
            Packspace met à votre disposition différents moyens de contacter notre Service Client afin de faciliter votre expérience sur notre site.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#006294] to-[#C09200] mx-auto rounded-full mb-16"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card
                key={index}
                className={`group hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-border/30 backdrop-blur-sm ${method.color} text-white relative overflow-hidden`}
              >
                <CardContent className="p-10 text-center relative z-10">
                  <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6">
                    <Icon className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                    {method.title}
                  </h3>

                  <p className="mb-6 font-medium text-lg leading-relaxed opacity-90">
                    {method.subtitle}
                  </p>

                  <p className="text-xl font-bold mb-8 group-hover:text-yellow-200 transition-colors duration-300 tracking-wide">
                    {method.contact}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
