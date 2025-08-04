import Database from 'better-sqlite3'
import { join } from 'path'

interface Guide {
  id: number
  title: string
  slug: string
  description: string
  content: string
  difficulty: string
  category: string
  tags: string
  created_at: string
  updated_at: string
}

export default defineEventHandler(async event => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Guide slug is required',
      })
    }

    const dbPath = join(process.cwd(), 'content/database/rimworld.db')
    const db = new Database(dbPath)

    const guide = db.prepare('SELECT * FROM guides WHERE slug = ?').get(slug) as Guide | undefined

    if (!guide) {
      db.close()
      throw createError({
        statusCode: 404,
        statusMessage: 'Guide not found',
      })
    }

    // Parse JSON tags
    const guideWithParsedTags = {
      ...guide,
      tags: guide.tags ? JSON.parse(guide.tags) : [],
    }

    db.close()

    return guideWithParsedTags
  } catch (error: unknown) {
    console.error('Error fetching guide:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch guide',
    })
  }
})
