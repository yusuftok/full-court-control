// Construction-themed utility functions for adding whimsy and personality

// Fun construction-related messages for different states
export const constructionMessages = {
  loading: [
    'Mixing concrete... 🏭',
    'Reading blueprints... 🗺️',
    'Checking safety protocols... ⚡',
    'Coordinating with the crew... 👷',
    'Measuring twice, cutting once... 📏',
    'Quality control in progress... ✅',
    'Laying the foundation... 🧱',
    'Hoisting the crane... 🏗️',
    'Reviewing work orders... 📋',
    'Prepping the site... 🚜',
  ],
  success: [
    'Built to perfection! 🏢',
    'Inspection passed! ✅',
    'Another quality build! 🔨',
    'Crew did great work! 👷',
    'Project milestone reached! 🎆',
    'Foundation solid as a rock! 🪨',
    'Blueprints executed flawlessly! 🗺️',
    'Safety standards exceeded! ⚡',
    'Ready for the next phase! 🚀',
  ],
  error: [
    'Oops! Hit a snag in the plans... 🚫',
    'Site supervisor needs to review this... 👷‍♂️',
    'Time to call in the experts... 📞',
    'Safety check required... ⚠️',
    'Blueprint revision needed... 🗺️',
    'Material delivery delayed... 🚚',
    'Weather conditions not ideal... 🌧️',
    'Permits need approval... 📄',
  ],
  empty: [
    'The job site is quiet for now... 🏗️',
    'No active construction here... 🚧',
    'Time to break ground! ⛏️',
    'Ready for the first blueprint... 🗺️',
    'Construction zone ready for action... 🚜',
    "Hard hats on, let's build something! 👷",
    'Site is prepped and ready... ⚙️',
  ],
}

// Get random construction message
export function getConstructionMessage(
  type: keyof typeof constructionMessages
): string {
  const messages = constructionMessages[type]
  return messages[Math.floor(Math.random() * messages.length)]
}

// Construction-themed status mappings
export const constructionStatusMap = {
  pending: { label: '🕰️ On Deck', color: 'yellow' },
  'in-progress': { label: '🔨 Hammering Away', color: 'blue' },
  completed: { label: '✅ Built & Inspected', color: 'green' },
  archived: { label: '📦 Stored Away', color: 'gray' },
  active: { label: '🔨 Under Construction', color: 'blue' },
  inactive: { label: '🚫 Site Closed', color: 'red' },
  cancelled: { label: '❌ Project Scrapped', color: 'red' },
}

// Construction priority levels
export const constructionPriorityMap = {
  low: { label: '😴 When You Can', color: 'gray' },
  medium: { label: '🔋 Standard Job', color: 'blue' },
  high: { label: '⚡ Rush Order', color: 'orange' },
  urgent: { label: '🚨 All Hands On Deck', color: 'red' },
}

// Fun placeholder names for construction entities
export const constructionPlaceholders = {
  projectNames: [
    'Skyline Tower Complex',
    'Foundation Plaza',
    'Blueprint Boulevard',
    'Hammer Heights',
    'Concrete Canyon',
    'Steel Structure Station',
    "Mason's Masterpiece",
    "Architect's Dream",
    "Builder's Paradise",
    'Construction Central',
  ],
  taskNames: [
    'Frame the walls',
    'Pour foundation',
    'Install plumbing',
    'Wire electrical systems',
    'Hang drywall',
    'Paint interior walls',
    'Install flooring',
    'Mount light fixtures',
    'Final safety inspection',
    'Site cleanup',
  ],
  divisionNames: [
    'Structural Framework',
    'Mechanical Systems',
    'Electrical Infrastructure',
    'Plumbing Network',
    'HVAC Installation',
    'Interior Finishing',
    'Exterior Facade',
    'Site Preparation',
    'Quality Control',
    'Safety Compliance',
  ],
}

// Get random placeholder
export function getConstructionPlaceholder(
  type: keyof typeof constructionPlaceholders
): string {
  const items = constructionPlaceholders[type]
  return items[Math.floor(Math.random() * items.length)]
}

// Construction-themed validation messages
export const constructionValidationMessages = {
  required: 'Hey chief, this field needs some attention! 👷',
  email:
    "That email address doesn't look quite right - double-check the blueprints? 📧",
  minLength:
    'We need a bit more detail here - like adding extra support beams! 🔨',
  maxLength:
    "Whoa there! That's more detail than we need - keep it blueprint-sized! 🗺️",
  number: 'Numbers only in this field - just like measuring lumber! 📏',
  positive:
    'This needs to be a positive number - no negative vibes on the job site! ✨',
  password: 'Make that password strong as reinforced concrete! 🔒',
}

// Progress calculation utilities
export function calculateConstructionProgress(
  completed: number,
  total: number
): {
  percentage: number
  message: string
  emoji: string
} {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  let message: string
  let emoji: string

  if (percentage === 0) {
    message = 'Breaking ground soon!'
    emoji = '⛏️'
  } else if (percentage < 25) {
    message = 'Foundation phase'
    emoji = '🧱'
  } else if (percentage < 50) {
    message = 'Framing underway'
    emoji = '🔨'
  } else if (percentage < 75) {
    message = 'Taking shape nicely'
    emoji = '🏢'
  } else if (percentage < 100) {
    message = 'Final touches'
    emoji = '🎨'
  } else {
    message = 'Ready for occupancy!'
    emoji = '✅'
  }

  return { percentage, message, emoji }
}
