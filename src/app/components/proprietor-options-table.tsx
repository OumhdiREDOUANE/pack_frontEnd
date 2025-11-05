"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Image as ImageIcon } from "lucide-react"

type OptionType = {
  name_option: string
  image_option: string
  description_option: string
  count_proprieter: number
  prix?: number
}

interface OptionDashboardProps {
  options: OptionType[]
  onEdit: (option: OptionType) => void
  onDelete: (option: OptionType) => void
  loading?: boolean
  error?: string | null
}

export function OptionDashboardTable({
  options,
  onEdit,
  onDelete,
  loading = true,
  error = null,
}: OptionDashboardProps) {
  if (loading) {
    return <div className="text-center py-8">Loading options...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">error</div>
  }

  if (options.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No options found.</div>
  }

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              {/* Image + Title */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary/10 flex items-center justify-center rounded-md overflow-hidden">
                  {option.image_option ? (
                    <img
                      src={option.image_option}
                      alt={option.name_option}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{option.name_option}</CardTitle>
                  <p className="text-sm text-muted-foreground">{option.description_option}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {option.prix && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <span className="text-sm">Prix:</span>
                    <span>{option.prix} MAD</span>
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => onEdit(option)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(option)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {option.prix && (
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Prix</span>
                <span className="text-sm font-bold text-primary">{option.prix} MAD</span>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
