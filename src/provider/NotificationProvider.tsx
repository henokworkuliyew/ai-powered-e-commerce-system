'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'user' | 'product' | 'system'
  read: boolean
  createdAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: {
    type: 'order' | 'user' | 'product' | 'system'
    title: string
    message: string
  }) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [ws, setWs] = useState<WebSocket | null>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: {
    type: 'order' | 'user' | 'product' | 'system'
    title: string
    message: string
  }) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    toast({
      title: notification.title,
      description: notification.message,
      variant: 'default',
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    const reconnectDelay = 5000

    const setupWebSocket = async () => {
      try {
        const response = await fetch('/api/websocket', {
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error(
            `Failed to fetch WebSocket URL: ${response.status} ${response.statusText}`
          )
        }

        const { url } = await response.json()
        if (!url || typeof url !== 'string') {
          throw new Error('Invalid or missing WebSocket URL')
        }

        const socket = new WebSocket(url)

        socket.onopen = () => {
          console.log('WebSocket connection established')
          reconnectAttempts = 0
          setWs(socket)
        }

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            switch (data.type) {
              case 'new_order':
                addNotification({
                  type: 'order',
                  title: 'New Order',
                  message: `Order #${data.orderId} has been placed`,
                })
                break
              case 'order_status':
                addNotification({
                  type: 'order',
                  title: 'Order Status Update',
                  message: `Order #${data.orderId} status changed to ${data.status}`,
                })
                break
              case 'new_user':
                addNotification({
                  type: 'user',
                  title: 'New User',
                  message: `New user ${data.userName} has registered`,
                })
                break
              case 'low_stock':
                addNotification({
                  type: 'product',
                  title: 'Low Stock Alert',
                  message: `Product ${data.productName} is running low on stock`,
                })
                break
              default:
                addNotification({
                  type: 'system',
                  title: 'System Notification',
                  message: data.message || 'Unknown notification',
                })
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error)
          }
        }

        socket.onerror = (error) => {
          console.error('WebSocket error:', error, 'URL:', url)
        }

        socket.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason)
          setWs(null)
          if (reconnectAttempts < maxReconnectAttempts) {
            console.log(
              `Reconnecting WebSocket in ${reconnectDelay / 1000}s...`
            )
            setTimeout(() => {
              reconnectAttempts++
              setupWebSocket()
            }, reconnectDelay)
          } else {
            console.error('Max WebSocket reconnect attempts reached')
          }
        }

        return () => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.close(1000, 'Component unmounted')
          }
        }
      } catch (error) {
        console.error('Error setting up WebSocket:', error)
        setWs(null)
      }
    }

    setupWebSocket()

    return () => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Component unmounted')
      }
    }
  }, [ws])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    )
  }
  return context
}
