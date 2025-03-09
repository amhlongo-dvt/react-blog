import { User } from '../db/models/user'

export async function createUser({ username, password }) {
  const user = new User({ username, password })
  return await user.save()
}
