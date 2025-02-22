import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'

import initDatabase from '../db/models/init.js'

beforeAll(async () => {
  await initDatabase()
})

afterAll(async () => {
  await mongoose.connection.close()
})
