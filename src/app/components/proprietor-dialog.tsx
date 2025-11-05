"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Proprietor {
  id_proprieter: string
  name_proprieter: string
  description_proprieter: string
}

interface ProprietorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proprietor?: Proprietor | null
  onSave: (proprietorData: Partial<Proprietor>) => void
}

export function ProprietorDialog({ open, onOpenChange, proprietor, onSave }: ProprietorDialogProps) {
  const [formData, setFormData] = useState({
    name_proprieter: "",
    description_proprieter: ""
  })

  useEffect(() => {
    if (proprietor) {
      setFormData({
        name_proprieter: proprietor.name_proprieter,
        description_proprieter: proprietor.description_proprieter
      })
    } else {
      setFormData({
        name_proprieter: "",
        description_proprieter: ""
      })
    }
  }, [proprietor, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{proprietor ? "Edit Proprietor" : "Add New Proprietor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name_proprieter">Proprietor Name</Label>
            <Input
              id="name_proprieter"
              value={formData.name_proprieter}
              onChange={(e) => setFormData({ ...formData, name_proprieter: e.target.value })}
              placeholder="Enter proprietor name..."
              required
            />
          </div>
          <div className="grid gap-2">
                        <Label htmlFor="description_product">Description</Label>
                        <Textarea
                          id="description_product"
                          value={formData.description_proprieter}
                          onChange={(e) => setFormData({ ...formData, description_proprieter: e.target.value })}
                          placeholder="Enter product description"
                          rows={3}
                          required
                        />
                      </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{proprietor ? "Update Proprietor" : "Create Proprietor"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
