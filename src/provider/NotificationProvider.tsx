'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Notification, NotificationContextType } from '@//type/notification'
import { useSocket } from '@/hooks/useSocket'


const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const socket = useSocket()

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

    setNotifications((prev) => [newNotification, ...prev].slice(0, 100))

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
    try {
      const savedNotifications = localStorage.getItem('notifications')
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications) as Notification[]
        if (Array.isArray(parsed)) {
          setNotifications(
            parsed.map((n) => ({
              ...n,
              createdAt: new Date(n.createdAt),
            }))
          )
        }
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error)
      localStorage.removeItem('notifications')
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error)
    }
  }, [notifications])

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket.IO connection established')
      })

      socket.on(
        'notification',
        (data: {
          type: string
          orderId?: string
          status?: string
          userName?: string
          productName?: string
          message?: string
        }) => {
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
        }
      )

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error)
        addNotification({
          type: 'system',
          title: 'Connection Error',
          message: 'Unable to connect to notification server',
        })
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason)
      })

      return () => {
        socket.off('notification')
        socket.off('connect')
        socket.off('connect_error')
        socket.off('disconnect')
      }
    }
  }, [socket])

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

export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    )
  }
  return context
}
