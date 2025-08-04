import Database from 'better-sqlite3'
import { join } from 'path'

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

    const guide = db.prepare('SELECT * FROM guides WHERE slug = ?').get(slug) as any

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
  } catch (error: any) {
    console.error('Error fetching guide:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch guide',
    })
  }
})
