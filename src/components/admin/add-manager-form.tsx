'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { addManager } from '@/action/manager-actions'

export default function AddManagerForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactPhone: '',
    warehouse: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.'
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    if (!formData.warehouse) {
      newErrors.warehouse = 'Warehouse is required for managers.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await addManager(formData)

      if (result.success) {
        toast({
          title: 'Manager added successfully',
          description: `${formData.name} has been added as a manager.`,
        })
        setFormData({
          name: '',
          email: '',
          password: '',
          contactPhone: '',
          warehouse: '',
        })
        router.refresh()
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to add manager',
          description: result.error || 'An unknown error occurred.',
        })
      }
    } catch (error) {
        if (error instanceof Error) {
        console.error('Error adding manager:', error.message)
        }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Must be at least 8 characters long.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="warehouse">Warehouse</Label>
        <Input
          id="warehouse"
          name="warehouse"
          placeholder="Main Warehouse"
          value={formData.warehouse}
          onChange={handleChange}
        />
        {errors.warehouse && (
          <p className="text-sm text-red-500">{errors.warehouse}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
        <Input
          id="contactPhone"
          name="contactPhone"
          placeholder="+1 (555) 123-4567"
          value={formData.contactPhone}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Manager...
          </>
        ) : (
          'Add Manager'
        )}
      </Button>
    </form>
  )
}
