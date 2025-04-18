'use client'

import type React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

type Address = {
  name: string
  email: string
  phone: string
  street: string
  city: string
  country: string
  zipCode: string
}

interface ShippingAddressFormProps {
  address: Address
  onAddressChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  onSelectChange?: (name: string, value: string) => void
}

const countries = [
  'Ethiopia',
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'China',
  'Japan',
  'Brazil',
  'South Africa',
  'Mexico',
]

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  address,
  onAddressChange,
  onSelectChange,
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enter Your Shipping Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={address.name}
              onChange={onAddressChange}
              placeholder="Henok Worku"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={address.email}
              onChange={onAddressChange}
              placeholder="example@mail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              value={address.phone}
              onChange={onAddressChange}
              placeholder="+251925254436"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              type="text"
              name="street"
              value={address.street}
              onChange={onAddressChange}
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              name="city"
              value={address.city}
              onChange={onAddressChange}
              placeholder="Bahir Dar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={address.country}
              onValueChange={(value) =>
                onSelectChange && onSelectChange('country', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={onAddressChange}
              placeholder="10001"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ShippingAddressForm
