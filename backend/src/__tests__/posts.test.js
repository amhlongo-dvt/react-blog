import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'

import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let testUser = null
let samplePosts = []

beforeAll(async () => {
  testUser = await createUser({ username: 'Test', password: 'Mhlongo' })
  samplePosts = [
    {
      title: 'First Post',
      contents: 'This is the content of the first post',
      author: testUser._id,
      tags: ['tech', 'programming'],
    },
    {
      title: 'Second Post',
      contents: 'Content for the second post',
      author: testUser._id,
      tags: ['lifestyle', 'travel'],
    },
    {
      title: 'Third Post',
      contents: 'Content of the third post',
      author: testUser._id,
      tags: ['tech', 'tutorial'],
    },
  ]
})

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = samplePosts.at(0)
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost.contents).toEqual('This is the content of the first post')
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('with minimal parameters should succeed', async () => {
    const post = samplePosts.at(0)
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('should fail if title is not provided', async () => {
    const post = {
      content: 'Content for the second post',
      author: testUser._id,
      tags: ['lifestyle', 'travel'],
    }
    try {
      await createPost(testUser._id, post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('should fail if author is not provided', async () => {
    const post = {
      content: 'Content for the second post',
      title: 'Hello Me',
      tags: ['lifestyle', 'travel'],
    }
    try {
      await createPost(testUser._id, post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`author` is required')
    }
  })
})

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
    const posts = await listPostsByAuthor(testUser._id)
    expect(posts.length).toBe(3)
  })

  test('should be able to filer posts by tag', async () => {
    const posts = await listPostsByTag('tech')
    expect(posts.length).toBe(2)
  })
})

describe('getting post by ID', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.title).toEqual('First Post')
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail is getting a post that does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      author: testUser._id,
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual(testUser._id)
  })

  test('should not update other properties', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      author: testUser._id,
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('First Post')
  })

  test('should update the UpdatedAt timestamp', async () => {
    await updatePost(testUser._id, createdSamplePosts[0]._id, {
      author: testUser._id,
    })

    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      author: testUser._id,
    })

    expect(post).toBe(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })

  test('should fail if post does not exist', async () => {
    const result = await deletePost(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
