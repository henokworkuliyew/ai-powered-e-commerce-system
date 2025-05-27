'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/type/User'
import { Eye, EyeOff, Edit, Save, X } from 'lucide-react'
import { UploadDropzone } from '@/hooks/utils/uploadthing'

interface ProfileViewProps {
  user: User
  onUpdate: (data: Partial<User>) => void
}

export default function ProfileView({ user, onUpdate }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    image: user.image || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData: any = {}
      if (formData.name !== user.name) updateData.name = formData.name
      if (formData.email !== user.email) updateData.email = formData.email
      if (formData.image !== user.image) updateData.image = formData.image
      if (formData.password) updateData.password = formData.password

      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        return
      }

      const response = await fetch(`/api/register/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) throw new Error('Update failed')

      const result = await response.json()
      onUpdate(result.user)
      setIsEditing(false)
      setFormData((prev) => ({ ...prev, password: '' }))
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = (res: any[]) => {
    if (res?.[0]?.url) {
      setFormData((prev) => ({ ...prev, image: res[0].url }))
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: 'bg-red-50 text-red-700 border-red-200',
      MANAGER: 'bg-blue-50 text-blue-700 border-blue-200',
      CARRIER: 'bg-green-50 text-green-700 border-green-200',
      USER: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return colors[role as keyof typeof colors] || colors.USER
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-gray-100">
                <AvatarImage
                  src={user.image || '/placeholder.svg'}
                  alt={user.name}
                />
                <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-gray-900">
                  {user.name}
                </CardTitle>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <Badge
                  className={`mt-1 text-xs border ${getRoleColor(user.role)}`}
                >
                  {user.role}
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'outline' : 'default'}
              size="sm"
              className="h-8"
            >
              {isEditing ? (
                <X className="h-3 w-3 mr-1" />
              ) : (
                <Edit className="h-3 w-3 mr-1" />
              )}
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm text-gray-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-1 border-gray-200 focus:border-gray-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="mt-1 border-gray-200 focus:border-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm text-gray-700">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Leave blank to keep current"
                    className="border-gray-200 focus:border-gray-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700">Profile Image</Label>
                <div className="mt-1">
                  <UploadDropzone
                    className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors ut-button:bg-gray-900 ut-button:hover:bg-gray-800 ut-allowed-content:text-gray-600 ut-label:text-gray-700"
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={(error) => {
                      if (error instanceof Error) {
                        console.error('Upload error:', error.message)
                      } else {
                        console.error('unknown error:', error)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="h-3 w-3 mr-2" />
                  )}
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: user.name,
                      email: user.email,
                      password: '',
                      image: user.image || '',
                    })
                    setIsEditing(false)
                  }}
                  size="sm"
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Role-specific minimal info */}
      {user.role === 'MANAGER' && user.warehouse && (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-3">
            <div className="text-sm">
              <span className="text-gray-600">Warehouse:</span>
              <span className="ml-2 text-gray-900">{user.warehouse}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {user.role === 'CARRIER' && (user.vehicle || user.zone) && (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {user.vehicle && (
                <div>
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="ml-2 text-gray-900">{user.vehicle}</span>
                </div>
              )}
              {user.zone && (
                <div>
                  <span className="text-gray-600">Zone:</span>
                  <span className="ml-2 text-gray-900">{user.zone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
