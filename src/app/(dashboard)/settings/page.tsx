"use client"

import React, { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

interface Settings {
  id?: number
  contact_phone: string
  contact_whatsapp: string
  contact_email: string
  promo_code: string
  url_image_hero?: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    contact_phone: "",
    contact_whatsapp: "",
    contact_email: "",
    promo_code: "",
    url_image_hero: "",
  })
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

  /** ----------- Charger les settings existants ----------- */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/setting`)
        if (!res.ok) throw new Error("Erreur lors du chargement")
        const data: Settings = await res.json()
        setSettings(data)
        setPreviewImage(data.url_image_hero || null)
      } catch (err) {
        console.error("Erreur lors du chargement :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [API_BASE_URL])

  /** ----------- Gestion de la sélection d'image ----------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  /** ----------- Enregistrement ----------- */
  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append("contact_phone", settings.contact_phone)
      formData.append("contact_whatsapp", settings.contact_whatsapp)
      formData.append("contact_email", settings.contact_email)
      formData.append("promo_code", settings.promo_code)

      // Pour Laravel : si route PUT, soit fetch en PUT (ok) soit POST + _method
      formData.append("_method", "PUT")
      if (imageFile) formData.append("url_image_hero", imageFile)

      const id = settings.id ?? 1 // fallback si un seul enregistrement
      const res = await fetch(`${API_BASE_URL}/api/setting/${id}`, {
        method: "POST", // on envoie en POST mais _method=PUT
        body: formData,
      })

      if (!res.ok) throw new Error("Échec de l’enregistrement")

      const updated: Settings = await res.json()
      setSettings(updated)
      if (updated.url_image_hero) setPreviewImage(updated.url_image_hero)
      alert("Settings saved successfully!")
      setImageFile(null)
    } catch (err) {
      console.error(err)
      alert("Error saving settings")
    }
  }

  /** ----------- Rendu ----------- */
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Settings</CardTitle>
              <CardDescription>
                Manage your contact info and hero image
              </CardDescription>
            </CardHeader>

            {loading ? (
              <CardContent>
                <div className="text-center">Loading…</div>
              </CardContent>
            ) : (
              <CardContent className="space-y-4">
                {/* Phone */}
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_phone: e.target.value })
                    }
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={settings.contact_whatsapp}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_whatsapp: e.target.value })
                    }
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={settings.contact_email}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_email: e.target.value })
                    }
                  />
                </div>

                {/* Upload image */}
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <div className="grid gap-2">
                      <img
                        src={previewImage}
                        alt="preview"
                        className="w-32 h-32 rounded object-cover border"
                      />
                    </div>
                  )}
                </div>

                {/* Promo */}
                <div className="space-y-2">
                  <Label>Promo Code</Label>
                  <Input
                    value={settings.promo_code}
                    onChange={(e) =>
                      setSettings({ ...settings, promo_code: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
