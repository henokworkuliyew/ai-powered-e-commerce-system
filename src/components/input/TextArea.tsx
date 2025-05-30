'use client'

import React from 'react'
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form'

interface TextAreaProps {
  id: string
  label: string
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  disabled = false,
  required = false,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative mt-6">
      <textarea
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
        className={`
          peer
          w-full
          p-3
          pt-6
          outline-none
          border-white
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
          ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-300'}
        `}
      />
      <label
        htmlFor={id}
        className={`
      absolute
      cursor-text
      duration-150
      transform
      -translate-y-3
      text-md
      max-h-[150px]
      min-h-[150px]
      text-blue-500
      top-4
      z-10
      origin-[0]
      left-4
      peer-placeholder-shown:scale-100
      peer-placeholder-shown:translate-y-0
      peer-focus:scale-75
      peer-focus:-translate-y-5
      ${errors[id] ? 'focus:text-rose-400' : 'focus:text-slate-300'}
      `}
      >
        {label}
      </label>
    </div>
  )
}

export default TextArea
