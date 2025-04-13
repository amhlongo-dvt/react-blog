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
  // Create a test user.
  testUser = await createUser({ username: 'Test', password: 'Mhlongo' })

  // Prepare sample posts using the correct field names.
  samplePosts = [
    {
      title: 'First Post',
      contents: 'This is the content of the first post',
      // Although the post object here contains the author,
      // when using createPost the userId is passed separately.
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
    const post = samplePosts[0]
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost.contents).toEqual('This is the content of the first post')
    expect(foundPost).toEqual(
      expect.objectContaining({
        title: post.title,
        contents: post.contents,
        tags: post.tags,
      }),
    )
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: samplePosts[0].title,
      contents: samplePosts[0].contents,
      tags: samplePosts[0].tags,
    }
    const createdPost = await createPost(testUser._id, post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('should fail if title is not provided', async () => {
    // Omit the title so that validation fails
    const post = {
      contents: 'Content for the second post',
      tags: ['lifestyle', 'travel'],
    }
    await expect(createPost(testUser._id, post)).rejects.toThrow(
      /`title` is required/,
    )
  })

  test('should fail if author is not provided', async () => {
    // Pass undefined as the userId to simulate a missing author.
    const post = {
      title: 'Hello Me',
      contents: 'Content for the second post',
      tags: ['lifestyle', 'travel'],
    }
    await expect(createPost(undefined, post)).rejects.toThrow(
      /`author` is required/,
    )
  })
})

let createdSamplePosts = []

beforeEach(async () => {
  // Clear out the posts collection.
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
    const sortedSamplePosts = [...createdSamplePosts].sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    // Compare ISO strings since Date objects may not be directly equal.
    expect(posts.map((post) => post.createdAt.toISOString())).toEqual(
      sortedSamplePosts.map((post) => post.createdAt.toISOString()),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })

    const sortedSamplePosts = [...createdSamplePosts].sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(posts.map((post) => post.updatedAt.toISOString())).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt.toISOString()),
    )
  })

  test('should be able to filter posts by author', async () => {
    // Note: listPostsByAuthor expects a username, not an ObjectId.
    const posts = await listPostsByAuthor(testUser.username)
    expect(posts.length).toBe(3)
  })

  test('should be able to filter posts by tag', async () => {
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

  test('should return null for a non-existent post', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    const updatedTitle = 'Updated Title'
    const updatedPost = await updatePost(
      testUser._id,
      createdSamplePosts[0]._id,
      { title: updatedTitle },
    )
    expect(updatedPost.title).toEqual(updatedTitle)
  })

  test('should not update unspecified properties', async () => {
    const originalContents = createdSamplePosts[0].contents
    const updatedPost = await updatePost(
      testUser._id,
      createdSamplePosts[0]._id,
      { title: 'New Title' },
    )
    expect(updatedPost.contents).toEqual(originalContents)
  })

  test('should update the updatedAt timestamp', async () => {
    const oldUpdatedAt = createdSamplePosts[0].updatedAt.getTime()
    // Introduce a slight delay to ensure a different timestamp.
    await new Promise((resolve) => setTimeout(resolve, 10))
    const updatedPost = await updatePost(
      testUser._id,
      createdSamplePosts[0]._id,
      { title: 'Another Title' },
    )
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt)
  })

  test('should return null if the post id does not exist', async () => {
    const post = await updatePost(testUser._id, '000000000000000000000000', {
      title: 'Non-existent Title',
    })
    expect(post).toBe(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(testUser._id, createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toBeNull()
  })

  test('should fail quietly if the post does not exist', async () => {
    const result = await deletePost(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
