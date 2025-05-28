// 'use client'

// import { Bell } from 'lucide-react'
// import { Button } from '@/components/ui/button2'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
// import { Badge } from '@/components/ui/badge'
// import { formatDistanceToNow } from 'date-fns'
// import { useNotificationContext } from '@/provider/NotificationProvider'

// export function NotificationBell() {
//   const {
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     removeNotification,
//   } = useNotificationContext()

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'order':
//         return '📦'
//       case 'user':
//         return '👤'
//       case 'product':
//         return '🛍️'
//       case 'system':
//         return '⚙️'
//       default:
//         return '🔔'
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge
//               variant="destructive"
//               className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
//             >
//               {unreadCount > 99 ? '99+' : unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-80">
//         <DropdownMenuLabel className="flex items-center justify-between">
//           Notifications
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={markAllAsRead}
//               className="h-auto p-1 text-xs"
//             >
//               Mark all read
//             </Button>
//           )}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />

//         {notifications.length === 0 ? (
//           <div className="p-4 text-center text-sm text-muted-foreground">
//             No notifications
//           </div>
//         ) : (
//           <div className="max-h-96 overflow-y-auto">
//             {notifications.slice(0, 10).map((notification: Notification) => (
//               <DropdownMenuItem
//                 key={notification.id}
//                 className={`flex flex-col items-start p-3 cursor-pointer ${
//                   !notification.read ? 'bg-muted/50' : ''
//                 }`}
//                 onClick={() =>
//                   !notification.read && markAsRead(notification.id)
//                 }
//               >
//                 <div className="flex items-start gap-2 w-full">
//                   <span className="text-lg">
//                     {getNotificationIcon(notification.type)}
//                   </span>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                       <p className="font-medium text-sm truncate">
//                         {notification.title}
//                       </p>
//                       {!notification.read && (
//                         <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
//                       {notification.message}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {formatDistanceToNow(notification.createdAt, {
//                         addSuffix: true,
//                       })}
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       removeNotification(notification.id)
//                     }}
//                     className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     ×
//                   </Button>
//                 </div>
//               </DropdownMenuItem>
//             ))}
//           </div>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
