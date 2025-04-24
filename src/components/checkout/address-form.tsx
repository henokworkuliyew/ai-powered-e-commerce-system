'use client'

import type React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export interface AddressData {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface AddressFormProps {
  type: 'shipping' | 'billing'
  address: AddressData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AddressForm({ type, address, onChange }: AddressFormProps) {
  const prefix = type === 'shipping' ? 'shipping' : 'billing'

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}FullName`} className="font-medium">
            Full Name
          </Label>
          <Input
            id={`${prefix}FullName`}
            name="fullName"
            value={address.fullName}
            onChange={onChange}
            required
            className="border-gray-300 focus:ring-2 focus:ring-primary/20"
            placeholder="John Doe"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}PhoneNumber`} className="font-medium">
            Phone Number
          </Label>
          <Input
            id={`${prefix}PhoneNumber`}
            name="phoneNumber"
            value={address.phoneNumber}
            onChange={onChange}
            required
            className="border-gray-300 focus:ring-2 focus:ring-primary/20"
            placeholder="+251 91 234 5678"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${prefix}AddressLine1`} className="font-medium">
          Address Line 1
        </Label>
        <Input
          id={`${prefix}AddressLine1`}
          name="addressLine1"
          value={address.addressLine1}
          onChange={onChange}
          required
          className="border-gray-300 focus:ring-2 focus:ring-primary/20"
          placeholder="123 Main Street"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${prefix}AddressLine2`} className="font-medium">
          Address Line 2 (Optional)
        </Label>
        <Input
          id={`${prefix}AddressLine2`}
          name="addressLine2"
          value={address.addressLine2 || ''}
          onChange={onChange}
          className="border-gray-300 focus:ring-2 focus:ring-primary/20"
          placeholder="Apartment, Suite, Unit, etc."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}City`} className="font-medium">
            City
          </Label>
          <Input
            id={`${prefix}City`}
            name="city"
            value={address.city}
            onChange={onChange}
            required
            className="border-gray-300 focus:ring-2 focus:ring-primary/20"
            placeholder="Addis Ababa"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}State`} className="font-medium">
            State/Region
          </Label>
          <Input
            id={`${prefix}State`}
            name="state"
            value={address.state}
            onChange={onChange}
            required
            className="border-gray-300 focus:ring-2 focus:ring-primary/20"
            placeholder="Addis Ababa"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}PostalCode`} className="font-medium">
            Postal Code
          </Label>
          <Input
            id={`${prefix}PostalCode`}
            name="postalCode"
            value={address.postalCode}
            onChange={onChange}
            required
            className="border-gray-300 focus:ring-2 focus:ring-primary/20"
            placeholder="1000"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${prefix}Country`} className="font-medium">
            Country
          </Label>
          <Input
            id={`${prefix}Country`}
            name="country"
            value={address.country}
            onChange={onChange}
            required
            className="border-gray-300 focus:ring-2 focus:ring-primary/20"
            placeholder="Ethiopia"
          />
        </div>
      </div>
    </div>
  )
}
