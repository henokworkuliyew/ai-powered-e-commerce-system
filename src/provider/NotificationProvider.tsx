// 'use client'

// import type React from 'react'
// import { createContext, useContext, useState, useCallback } from 'react'

// export interface Notification {
//   id: string
//   title: string
//   message: string
//   type: 'order' | 'user' | 'product' | 'system'
//   read: boolean
//   createdAt: Date
// }

// export interface NotificationContextType {
//   notifications: Notification[]
//   unreadCount: number
//   addNotification: (notification: {
//     type: 'order' | 'user' | 'product' | 'system'
//     title: string
//     message: string
//   }) => void
//   markAsRead: (id: string) => void
//   markAllAsRead: () => void
//   removeNotification: (id: string) => void
//   clearAllNotifications: () => void
// }

// const NotificationContext = createContext<NotificationContextType | null>(null)

// export function useNotificationContext() {
//   const context = useContext(NotificationContext)
//   if (!context) {
//     throw new Error(
//       'useNotificationContext must be used within a NotificationProvider'
//     )
//   }
//   return context
// }

// interface NotificationProviderProps {
//   children: React.ReactNode
// }

// export function NotificationProvider({ children }: NotificationProviderProps) {
//   const [notifications, setNotifications] = useState<Notification[]>([])

//   const addNotification = useCallback(
//     (notification: {
//       type: 'order' | 'user' | 'product' | 'system'
//       title: string
//       message: string
//     }) => {
//       const newNotification: Notification = {
//         id: crypto.randomUUID(),
//         ...notification,
//         read: false,
//         createdAt: new Date(),
//       }

//       setNotifications((prev) => [newNotification, ...prev])
//     },
//     []
//   )

//   const markAsRead = useCallback((id: string) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     )
//   }, [])

//   const markAllAsRead = useCallback(() => {
//     setNotifications((prev) =>
//       prev.map((notification) => ({ ...notification, read: true }))
//     )
//   }, [])

//   const removeNotification = useCallback((id: string) => {
//     setNotifications((prev) =>
//       prev.filter((notification) => notification.id !== id)
//     )
//   }, [])

//   const clearAllNotifications = useCallback(() => {
//     setNotifications([])
//   }, [])

//   const unreadCount = notifications.filter(
//     (notification) => !notification.read
//   ).length

//   const value: NotificationContextType = {
//     notifications,
//     unreadCount,
//     addNotification,
//     markAsRead,
//     markAllAsRead,
//     removeNotification,
//     clearAllNotifications,
//   }

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   )
// }
