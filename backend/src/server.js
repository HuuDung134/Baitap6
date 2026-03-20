import http from 'http'
import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'
import { initRealtime } from './realtime/socket.js'
import { seedDemoUsers } from './utils/seed.js'

dotenv.config()

const cors = require('cors');

app.use(cors({
    origin: process.env.CLIENT_ORIGIN, // Nó sẽ lấy 'http://localhost' từ docker-compose
    credentials: true // Bật dòng này nếu ứng dụng của bạn có dùng Cookie hoặc Session
}));

const port = process.env.PORT || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/baitap6_metro'

async function start() {
  await connectDB(mongoUri)
  await seedDemoUsers()

  const server = http.createServer(app)
  initRealtime(server)

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`BaiTap6 backend listening on port ${port}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

