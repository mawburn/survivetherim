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
    const query = getQuery(event)
    const { category, difficulty, search, limit = 10, offset = 0 } = query

    const dbPath = join(process.cwd(), 'content/database/rimworld.db')
    const db = new Database(dbPath)

    let sql = 'SELECT * FROM guides WHERE 1=1'
    const params: unknown[] = []

    // Add filters
    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }

    if (difficulty) {
      sql += ' AND difficulty = ?'
      params.push(difficulty)
    }

    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR content LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Add ordering and pagination
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const guides = db.prepare(sql).all(...params)

    // Parse JSON tags
    const guidesWithParsedTags = (guides as Guide[]).map(guide => ({
      ...guide,
      tags: guide.tags ? JSON.parse(guide.tags) : [],
    }))

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM guides WHERE 1=1'
    const countParams: unknown[] = []

    if (category) {
      countSql += ' AND category = ?'
      countParams.push(category)
    }

    if (difficulty) {
      countSql += ' AND difficulty = ?'
      countParams.push(difficulty)
    }

    if (search) {
      countSql += ' AND (title LIKE ? OR description LIKE ? OR content LIKE ?)'
      const searchTerm = `%${search}%`
      countParams.push(searchTerm, searchTerm, searchTerm)
    }

    const { total } = db.prepare(countSql).get(...countParams) as { total: number }

    db.close()

    return {
      guides: guidesWithParsedTags,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total,
      },
    }
  } catch (error) {
    console.error('Error fetching guides:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch guides',
    })
  }
})
