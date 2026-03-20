import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

const DEMO_USERS = [
  { role: 'admin', email: 'admin@metro.com', password: 'admin123', name: 'Admin' },
  { role: 'staff', email: 'staff@metro.com', password: 'staff123', name: 'Staff' },
  { role: 'inspector', email: 'inspector@metro.com', password: 'inspector123', name: 'Inspector' },
  { role: 'passenger', email: 'passenger@metro.com', password: 'passenger123', name: 'Passenger' },
]

export async function seedDemoUsers() {
  for (const u of DEMO_USERS) {
    const exists = await User.findOne({ email: u.email })
    if (exists) continue
    const passwordHash = await bcrypt.hash(u.password, 10)
    await User.create({ name: u.name, email: u.email, role: u.role, passwordHash })
  }
}

