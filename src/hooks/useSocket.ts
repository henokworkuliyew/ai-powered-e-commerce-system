'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(): Socket | null {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
      {
        path: '/api/socket',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    )

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  return socketRef.current
}
