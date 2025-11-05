"use client"

import { useState, useEffect } from "react"
import { Phone, Mail, MessageCircle, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FAQPage({ faqItems }) {
  const [contactMethods, setContactMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedFAQ, setExpandedFAQ] = useState(null)
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

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setContactMethods([
        { id: "1", icon: <Phone className="w-8 h-8" />, title: "par Téléphone", subtitle: "Du Lundi au Vendredi de 9h à 18h", contact: settings.contact_phone || "", color: "text-[#C09200]" },
        { id: "2", icon: <Mail className="w-8 h-8" />, title: "par Email", subtitle: "7jours/7 - 24h/24", contact: settings.contact_email || "", color: "text-[#006294]" },
        { id: "3", icon: <MessageCircle className="w-8 h-8" />, title: "par WhatsApp", subtitle: "Du Lundi au Vendredi de 9h à 18h", contact: settings.contact_whatsapp || "", color: "text-[#006294]" },
      ])
      setLoading(false)
    }
    loadData()
  }, [settings])

  const toggleFAQ = (id) => setExpandedFAQ(expandedFAQ === id ? null : id)

  return (
    <div className="min-h-screen font-sans bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#C09200]/20 via-[#006294]/20 to-[#C09200]/10 overflow-hidden">
        <div className="relative z-10 px-6 py-16">
          <nav className="text-sm text-gray-500 mb-8">
            <span>Accueil</span> <span className="mx-2">-</span> <span>Aide</span> <span className="mx-2">-</span> <span className="font-medium text-gray-700">Questions</span>
          </nav>
          <h1 className="text-6xl md:text-8xl font-bold text-[#006294] mb-8">FAQ.</h1>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="p-6 text-center animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </Card>
              ))
            : contactMethods.map((method) => (
                <Card key={method.id} className="p-6 text-center border border-border/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className={`mb-4 flex justify-center ${method.color}`}>{method.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{method.subtitle}</p>
                    <p className="font-medium text-gray-800 mb-1">{method.contact}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#006294] hover:text-[#C09200] mb-8">En Bref</h2>
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 animate-pulse mb-4"></div>
              ))
            : faqItems.map((item) => (
                <div key={item.id} className="border-b overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full p-4 text-left justify-between"
                    onClick={() => toggleFAQ(item.id)}
                  >
                    <span className="font-medium text-gray-800">{item.question}</span>
                    {expandedFAQ === item.id ? (
                      <ChevronUp className="w-5 h-5 text-[#006294] hover:text-[#C09200]" />
                    ) : (
                      <span className="text-[#006294] hover:text-[#C09200] text-xl font-bold">+</span>
                    )}
                  </Button>
                  {expandedFAQ === item.id && (
                    <div className="px-4 pb-4 text-gray-600 font-medium leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
