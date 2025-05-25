
import { Server } from 'socket.io'
import { NextApiResponse } from 'next'
import http from 'http'

export async function GET(req: Request, res: NextApiResponse) {
  console.log(req,res)
  const httpServer = http.createServer()
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id)

    // Example: Emit a test notification
    socket.emit('notification', {
      type: 'system',
      message: 'Welcome to the notification system!',
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  httpServer.listen(3000, () => {
    console.log('Socket.IO server running on port 3001')
  })

  return new Response('Socket.IO server initialized', { status: 200 })
}
