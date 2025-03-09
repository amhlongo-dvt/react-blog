import mongoose from 'mongoose'
import { describe, expect, test, beforeAll } from '@jest/globals'
import { createUser, loginUser } from '../services/users.js'
import { User } from '../db/models/user.js'

let testUser = null
let createdUser = null
beforeAll(async () => {
  testUser = { username: 'Eliezer', password: 'Mhlongo' }
  // createdUser = await createUser(testUser)
})

describe('creating users', () => {
  test('with minimal parameters should succeed', async () => {
    createdUser = await createUser(testUser)
    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundUser = await User.findById(createdUser._id)
    expect(foundUser.username).toEqual('Eliezer')
  })

  test('should fail if creating using a registered username', async () => {
    try {
      await createUser(testUser)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain(
        'E11000 duplicate key error collection: test.users index: username_1 dup key: { username: "Eliezer" }',
      )
    }
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
describe('logging in users', () => {
  test('with minimal parameters should succeed', async () => {
    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const loggedUserToken = await loginUser({
      username: createdUser.username,
      password: 'Mhlongo',
    })
    expect(loggedUserToken).toBeTruthy
  })

  test('should fail if username is not valid', async () => {
    const user = { username: 'John', password: 'Mhlongo' }
    try {
      await loginUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('invalid username!')
    }
  })

  test('should fail if password is not valid', async () => {
    const user = { username: createdUser.username, password: 'Hello' }
    try {
      await loginUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('invalid password!')
    }
  })
})
