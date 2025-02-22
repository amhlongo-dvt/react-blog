import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'

import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Test Post',
      author: 'John Doe',
      content: 'This is a test post',
      tags: ['test', 'jest'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })
  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Test Post',
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('should fail if title is not provided', async () => {
    const post = {
      author: 'John Doe',
      content: 'This is a test post',
      tags: ['test', 'jest'],
    }
    try {
      await createPost(post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })
})

const samplePosts = [
  {
    title: 'First Post',
    content: 'This is the content of the first post',
    author: 'John Doe',
    tags: ['tech', 'programming'],
  },
  {
    title: 'Second Post',
    content: 'Content for the second post',
    author: 'Jane Smith',
    tags: ['lifestyle', 'travel'],
  },
  {
    title: 'Third Post',
    content: 'Content of the third post',
    author: 'John Doe',
    tags: ['tech', 'tutorial'],
  },
]

let createdSamplePosts = []

beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })

    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const posts = await listPostsByAuthor('John Doe')
    expect(posts.length).toBe(2)
  })

  test('should be able to filer posts by tag', async () => {
    const posts = await listPostsByTag('tech')
    expect(posts.length).toBe(2)
  })
})
