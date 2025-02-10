import { writeFileSync, readFileSync } from 'node:fs'

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
  },
]

const usersJson = JSON.stringify(users, null, 2)

writeFileSync('backend/users.json', usersJson)

const readUsers = readFileSync('backend/users.json', 'utf-8')
const readUsersJson = JSON.parse(readUsers)

console.log(readUsersJson)
