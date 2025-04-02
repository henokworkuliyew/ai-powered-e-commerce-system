import Heading from '@/components/ui/Heading'
import React from 'react'

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
}) => {
  return (
    <div className="p-4 border rounded-lg mb-6 ">
      <Heading text="Enter Your Shipping Details" gradient level={4} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-600">Full Name</label>
          <input
            type="text"
            name="name"
            value={address.name}
            onChange={onAddressChange}
            placeholder="Henok Worku"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={address.email}
            onChange={onAddressChange}
            placeholder="example@mail.com"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={address.phone}
            onChange={onAddressChange}
            placeholder="+251925254436"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-gray-600">Street Address</label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={onAddressChange}
            placeholder="123 Main St"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-600">City</label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={onAddressChange}
            placeholder="Bahir Dar"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-600">Country</label>
          <select
            name="country"
            value={address.country}
            onChange={onAddressChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Zip Code */}
        <div>
          <label className="block text-gray-600">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={address.zipCode}
            onChange={onAddressChange}
            placeholder="10001"
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default ShippingAddressForm
