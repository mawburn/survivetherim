// RimWorld data and utilities
export const useRimWorldData = () => {
  const colonistNames = [
    'Maya', 'Lucas', 'Zara', 'Rex', 'Nova', 'Kai', 'Luna', 'Phoenix',
    'Sage', 'Raven', 'Echo', 'Storm', 'Vale', 'Quinn', 'Zoe', 'Ash'
  ]

  const skills = [
    'Mining', 'Growing', 'Construction', 'Animals', 'Cooking',
    'Hunting', 'Medicine', 'Artistic', 'Crafting', 'Intellectual',
    'Social', 'Melee', 'Shooting'
  ]

  const traits = [
    'Hard Worker', 'Lazy', 'Bloodlust', 'Pacifist', 'Kind', 'Abrasive',
    'Psychopath', 'Cannibal', 'Night Owl', 'Early Bird', 'Fast Learner',
    'Slow Learner', 'Iron-Willed', 'Neurotic', 'Optimist', 'Pessimist'
  ]

  const moods = ['Happy', 'Content', 'Stressed', 'Breaking']

  const incidents = [
    'Raid incoming!', 'Solar flare detected', 'Trader caravan arrived',
    'Wild animals manhunting', 'Toxic fallout', 'Volcanic winter',
    'Ancient danger awakened', 'Mechanoid cluster landed',
    'Prisoner escape attempt', 'Blight destroyed crops'
  ]

  const baseNames = [
    'New Haven', 'Sanctuary', 'Haven Ridge', 'Last Stand', 'Hope Valley',
    'Steel Fortress', 'Greenlands', 'Survivor\'s Rest', 'Phoenix Base',
    'Unity Station', 'Freedom Point', 'Safe Harbor'
  ]

  const generateColonist = () => {
    const name = colonistNames[Math.floor(Math.random() * colonistNames.length)]
    const age = Math.floor(Math.random() * 60) + 18
    const health = Math.floor(Math.random() * 40) + 60
    const mood = moods[Math.floor(Math.random() * moods.length)]
    
    // Generate 3-5 random skills with levels
    const colonistSkills = []
    const numSkills = Math.floor(Math.random() * 3) + 3
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random())
    
    for (let i = 0; i < numSkills; i++) {
      colonistSkills.push({
        name: shuffledSkills[i],
        level: Math.floor(Math.random() * 10) + 1
      })
    }
    
    // Generate 1-3 traits
    const numTraits = Math.floor(Math.random() * 3) + 1
    const shuffledTraits = [...traits].sort(() => 0.5 - Math.random())
    const colonistTraits = shuffledTraits.slice(0, numTraits)
    
    return {
      id: Date.now() + Math.random(),
      name,
      age,
      health,
      mood,
      skills: colonistSkills,
      traits: colonistTraits
    }
  }

  const generateMultipleColonists = (count: number) => {
    const colonists = []
    const usedNames = new Set()
    
    for (let i = 0; i < count; i++) {
      let colonist = generateColonist()
      
      // Ensure unique names
      while (usedNames.has(colonist.name)) {
        colonist = generateColonist()
      }
      
      usedNames.add(colonist.name)
      colonists.push(colonist)
    }
    
    return colonists
  }

  return {
    colonistNames,
    skills,
    traits,
    moods,
    incidents,
    baseNames,
    generateColonist,
    generateMultipleColonists
  }
}