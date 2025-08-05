interface Guide {
  id: number
  title: string
  slug: string
  description: string
  content: string
  difficulty: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

// Mock data for now - replace with D1 database queries later
const mockGuides: Guide[] = [
  {
    id: 1,
    title: 'Getting Started in RimWorld',
    slug: 'getting-started',
    description: "A beginner's guide to surviving your first colony.",
    content: '# Getting Started\n\nWelcome to RimWorld! This guide will help you survive your first few days...',
    difficulty: 'Beginner',
    category: 'Basics',
    tags: ['survival', 'basics', 'tutorial'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Advanced Base Defense',
    slug: 'base-defense',
    description: 'Learn how to protect your colony from raids and threats.',
    content: '# Base Defense\n\nDefending your colony is crucial for long-term survival...',
    difficulty: 'Advanced',
    category: 'Combat',
    tags: ['defense', 'combat', 'strategy'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Food Production and Storage',
    slug: 'food-production',
    description: 'Master the art of keeping your colonists fed.',
    content: '# Food Production\n\nFood is the foundation of any successful colony...',
    difficulty: 'Intermediate',
    category: 'Production',
    tags: ['food', 'farming', 'storage'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default defineEventHandler(async event => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Guide slug is required',
      })
    }

    const guide = mockGuides.find(g => g.slug === slug)

    if (!guide) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Guide not found',
      })
    }

    return guide
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
