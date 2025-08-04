import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Initialize SQLite database
    const dbPath = join(process.cwd(), 'content/database/rimworld.db')
    const db = new Database(dbPath)
    
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'content/database/schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    // Execute schema statements
    const statements = schema.split(';').filter(stmt => stmt.trim())
    statements.forEach(statement => {
      if (statement.trim()) {
        db.exec(statement)
      }
    })
    
    // Insert sample data if tables are empty
    const guideCount = db.prepare('SELECT COUNT(*) as count FROM guides').get() as { count: number }
    
    if (guideCount.count === 0) {
      // Insert sample guides
      const insertGuide = db.prepare(`
        INSERT INTO guides (title, slug, description, content, difficulty, category, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      const sampleGuides = [
        {
          title: 'Getting Started in RimWorld',
          slug: 'getting-started',
          description: 'A beginner\'s guide to surviving your first colony.',
          content: '# Getting Started\n\nWelcome to RimWorld! This guide will help you survive your first few days...',
          difficulty: 'Beginner',
          category: 'Basics',
          tags: JSON.stringify(['survival', 'basics', 'tutorial'])
        },
        {
          title: 'Advanced Base Defense',
          slug: 'base-defense',
          description: 'Learn how to protect your colony from raids and threats.',
          content: '# Base Defense\n\nDefending your colony is crucial for long-term survival...',
          difficulty: 'Advanced',
          category: 'Combat',
          tags: JSON.stringify(['defense', 'combat', 'strategy'])
        },
        {
          title: 'Food Production and Storage',
          slug: 'food-production',
          description: 'Master the art of keeping your colonists fed.',
          content: '# Food Production\n\nFood is the foundation of any successful colony...',
          difficulty: 'Intermediate',
          category: 'Production',
          tags: JSON.stringify(['food', 'farming', 'storage'])
        }
      ]
      
      sampleGuides.forEach(guide => {
        insertGuide.run(
          guide.title,
          guide.slug,
          guide.description,
          guide.content,
          guide.difficulty,
          guide.category,
          guide.tags
        )
      })
      
      // Insert sample tips
      const insertTip = db.prepare(`
        INSERT INTO tips (title, content, category, difficulty)
        VALUES (?, ?, ?, ?)
      `)
      
      const sampleTips = [
        {
          title: 'Build tables and chairs',
          content: 'Colonists get a mood debuff when eating without a table. Always build dining areas!',
          category: 'Mood',
          difficulty: 'Beginner'
        },
        {
          title: 'Use zones effectively',
          content: 'Create stockpile zones near workbenches to reduce hauling time.',
          category: 'Efficiency',
          difficulty: 'Intermediate'
        },
        {
          title: 'Research priorities',
          content: 'Focus on researching electricity and air conditioning early for better quality of life.',
          category: 'Research',
          difficulty: 'Beginner'
        }
      ]
      
      sampleTips.forEach(tip => {
        insertTip.run(tip.title, tip.content, tip.category, tip.difficulty)
      })
    }
    
    db.close()
    
    return {
      success: true,
      message: 'Database initialized successfully'
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to initialize database'
    })
  }
})