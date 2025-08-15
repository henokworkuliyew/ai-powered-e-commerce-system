import { Loader2 } from 'lucide-react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-teal-500 mb-4`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
}
