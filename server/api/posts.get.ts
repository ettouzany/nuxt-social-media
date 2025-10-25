import { getPosts } from '~/server/utils/database-vercel'

export default defineEventHandler(async (event) => {
  try {
    return await getPosts()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})