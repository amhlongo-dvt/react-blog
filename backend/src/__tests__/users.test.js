import mongoose from 'mongoose'
import { describe, expect, test, beforeAll } from '@jest/globals'
import { createUser } from '../services/users.js'
import { User } from '../db/models/user.js'

let testUser = null
beforeAll(async () => {
  testUser = { username: 'Eliezer', password: 'Mhlongo' }
})

describe('creating users', () => {
  test('with minimal parameters should succeed', async () => {
    const createdUser = await createUser(testUser)
    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundUser = await User.findById(createdUser._id)
    expect(foundUser.username).toEqual('Eliezer')
  })

  test('should fail if username is not provided', async () => {
    const user = { password: 'Mhlongo' }
    try {
      await createUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`username` is required')
    }
  })

  test('should fail if password is not provided', async () => {
    const user = { username: 'Andile3' }
    try {
      await createUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('data and salt arguments required')
    }
  })
})
