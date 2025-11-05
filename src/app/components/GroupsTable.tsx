"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { GroupsDialog } from "@/components/groups-dialog"
import { DeleteGroupsDialog } from "@/components/delete-groups-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Group {
  id_group: number
  name_group: string
  description_group: string
  categorie_id: number
  name_categorie: string
}

export function GroupsTable() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

 

  const fetchGroups = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/groupsDashboard`)
      if (!res.ok) throw new Error("Failed to fetch groups")
      const data = await res.json()
    console.log(data)
      setGroups(data.data || [])

    } catch (err: any) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }
 useEffect(() => {
    fetchGroups()
  }, [])
    const categories = Array.from(new Set(groups.map((grp) => grp.name_categorie)))
  const filteredGroups = groups.filter(
    (grp) =>{
       const matchesSearch =     grp.name_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grp.description_group.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || grp.name_categorie === categoryFilter
    return matchesSearch && matchesCategory
    }
 
  )

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
   
  }
  const handleAddGroup = () => {
    setSelectedGroup(null)
    setIsDialogOpen(true)
  }

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group)
    setIsDialogOpen(true)
  }

  const handleDeleteGroup = (group: Group) => {
    setGroupToDelete(group)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveGroup = async (formData: FormData) => {
    if (selectedGroup) formData.append("_method", "PUT")

    try {
      const url = selectedGroup
        ? `${API_URL}/api/groupsDashboard/${selectedGroup.id_group}`
        : `${API_URL}/api/groupsDashboard`

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to save group")

      fetchGroups()
      setIsDialogOpen(false)
    } catch {
      setError("Erreur lors du chargement des groupes")
    }
  }

  const confirmDelete = async () => {
    if (groupToDelete) {
      try {
        const res = await fetch(`${API_URL}/api/groupsDashboard/${groupToDelete.id_group}`, {
          method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete group")
        fetchGroups()
        setIsDeleteDialogOpen(false)
        setGroupToDelete(null)
      } catch {
        setError("Erreur lors du chargement des groupes")
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Groups</CardTitle>
            <CardDescription>Manage groups and their assignments</CardDescription>
          </div>
          <Button onClick={handleAddGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Add group
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
          </div>

          <div className="rounded-md border">
            {loading ? (
              <p className="p-4 text-center text-muted-foreground">Loading groups...</p>
            ) : error ? (
              <p className="p-4 text-center text-red-500">{error}</p>
            ) : filteredGroups.length === 0 ? (
              <p className="p-4 text-center text-muted-foreground">No groups found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <TableRow key={group.id_group}>
                      <TableCell>{group.name_group}</TableCell>
                      <TableCell className="text-muted-foreground">{group.description_group}</TableCell>
                      <TableCell>{group.name_categorie}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteGroup(group)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <GroupsDialog
        group={selectedGroup}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveGroup}
      />

      <DeleteGroupsDialog
        group={groupToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </>
  )
}
