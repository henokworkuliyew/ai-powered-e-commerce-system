'use client'
import React, { ReactNode } from 'react'

interface ScrollableContainerProps {
  children: ReactNode
  className?: string
}

export default function ScrollableContainer({
  children,
  className = '',
}: ScrollableContainerProps) {
  return (
    <div
      className={`overflow-x-auto ${className}`}
      style={{
        scrollbarWidth: 'none' /* Firefox */,
        msOverflowStyle: 'none' /* IE and Edge */,
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      {children}
    </div>
  )
}
