// // src/app/api/notifications/route.ts
// import { NextResponse } from 'next/server'
// import { WebSocketServer, WebSocket } from 'ws'
// import { getCurrentUser } from '@/action/CurrentUser'
// import Order from '@/server/models/Order'
// import  dbConnect  from '@/lib/dbConnect'
// import { IncomingMessage } from 'http'

// export const dynamic = 'force-dynamic'

// const wss = new WebSocketServer({ noServer: true })
// const clients = new Map<string, WebSocket>()

// wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
//   console.log('WebSocket connection attempt:', req.url)
//   const url = new URL(req.url || '', 'http://localhost:3000')
//   const userId = url.searchParams.get('userId')

//   if (!userId) {
//     console.log('Closing connection: No userId provided')
//     ws.close(1008, 'User ID required')
//     return
//   }

//   console.log(`Client connected: userId=${userId}`)
//   clients.set(userId, ws)

//   ws.send(
//     JSON.stringify({
//       type: 'system',
//       message: 'Connected to notification system',
//       createdAt: new Date().toISOString(),
//     })
//   )

//   dbConnect()
//     .then(() => {
//       Order.watch()
//         .on('change', (change) => {
//           if (change.operationType === 'insert') {
//             const newOrder = change.fullDocument
//             console.log(
//               `Sending notification for order #${newOrder.orderNumber} to userId=${userId}`
//             )
//             ws.send(
//               JSON.stringify({
//                 type: 'new_order',
//                 orderId: newOrder.orderNumber,
//                 message: `Order #${newOrder.orderNumber} has been placed`,
//                 createdAt: new Date().toISOString(),
//               })
//             )
//           }
//         })
//         .on('error', (error) => {
//           console.error(`MongoDB watch error for userId=${userId}:`, error)
//         })
//     })
//     .catch((error) => {
      
//       console.error(`Failed to set up Order watch for userId=${userId}:`, error)
//       ws.close(1011, 'Server error')
//     })

//   ws.on('message', (message: Buffer) => {
//     console.log(`Received from userId=${userId}:`, message.toString())
//   })

//   ws.on('close', (event) => {
//     console.log(
//       `Client disconnected: userId=${userId}, code=${event.code}, reason=${event.reason}`
//     )
//     clients.delete(userId)
//   })

//   ws.on('error', (error) => {
//     console.error(`WebSocket server error for userId=${userId}:`, error)
//   })
// })

// export async function GET(req: Request) {
//   try {
//     console.log('WebSocket GET request:', req.url)
//     await dbConnect()
//     const user = await getCurrentUser()
//     console.log('Authenticated user:', user ? user.email : 'None')
//     if (!user) {
//       console.log('Unauthorized: No user found')
//       return new NextResponse('Unauthorized', { status: 401 })
//     }

//     if (req.headers.get('upgrade')?.toLowerCase() === 'websocket') {
//       console.log('WebSocket upgrade requested')
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const { socket }: { socket?: import('net').Socket } = (req as any).raw
//       if (!socket) {
//         console.log('No socket available')
//         return new NextResponse('No socket available', { status: 400 })
//       }

//       const incomingMessage = {
//         headers: Object.fromEntries(req.headers.entries()),
//         url: req.url,
//         method: req.method,
//       } as IncomingMessage

//       console.log('Upgrading to WebSocket')
//       wss.handleUpgrade(incomingMessage, socket, Buffer.alloc(0), (ws) => {
//         console.log('WebSocket connection established')
//         wss.emit('connection', ws, incomingMessage)
//       })

//       return new NextResponse(null, { status: 101 })
//     }

//     console.log('WebSocket upgrade required')
//     return new NextResponse('WebSocket upgrade required', { status: 426 })
//   } catch (error) {
//     console.error('[WEBSOCKET_GET]', error)
//     return new NextResponse('Internal error', { status: 500 })
//   }
// }
