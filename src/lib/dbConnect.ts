import mongoose from 'mongoose'

async function dbConnect() {
  try {
<<<<<<< HEAD
    await mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    })
=======
    await mongoose.connect(process.env.MONGODB_URI!)
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
  } catch (error) {
    console.log(error)
    throw new Error('Connection failed!')
  }
}

export default dbConnect