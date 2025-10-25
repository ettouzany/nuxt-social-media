import { createPost } from '~/server/utils/database-vercel'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.content || !body.content.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content is required'
      })
    }
    
    return await createPost(body.content)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create post'
    })
  }
})