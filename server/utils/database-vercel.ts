import { put, list } from '@vercel/blob'

export interface Post {
  id: number
  content: string
  timestamp: string
  created_at: string
}

const POSTS_BLOB_PATH = 'posts.json'

export async function getPosts(): Promise<Post[]> {
  try {
    // Check if posts.json blob exists
    const { blobs } = await list({ prefix: POSTS_BLOB_PATH })
    
    if (blobs.length === 0) {
      return []
    }
    
    // Fetch the posts.json content
    const postsBlob = blobs[0]
    const response = await fetch(postsBlob.url)
    const posts = await response.json()
    
    return posts.sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.error('Error getting posts:', error)
    return []
  }
}

export async function createPost(content: string): Promise<Post> {
  try {
    const posts = await getPosts()
    const newPost: Post = {
      id: Date.now(),
      content: content.trim(),
      timestamp: new Date().toLocaleString(),
      created_at: new Date().toISOString()
    }
    
    const updatedPosts = [newPost, ...posts]
    
    // Store updated posts array as JSON blob
    await put(POSTS_BLOB_PATH, JSON.stringify(updatedPosts), {
      access: 'public',
      allowOverwrite: true
    })
    
    return newPost
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}