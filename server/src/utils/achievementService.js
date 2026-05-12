const ACHIEVEMENT_LIST = [
  { code: 'first_step', title: 'Первый шаг' },
  { code: 'level_5', title: 'Оратор 5 уровня' },
  { code: 'streak_3', title: 'Стабильный оратор' },
  { code: 'ai_debate_5', title: 'Мастер споров' },
]

const checkAchievements = (user) => {
  const newAchievements = []
  const existingCodes = user.progression.achievements.map(
    (a) => a.code,
  )

  const add = (code, title) => {
    if (!existingCodes.includes(code)) {
      const achievement = { title, code, unlockedAt: new Date() }
      user.progression.achievements.push(achievement)
      newAchievements.push(achievement)
    }
  }

  // Проверка условий
  if (user.stats.totalExercises >= 1) add('first_step', 'Первый шаг')

  if (user.progression.level >= 5) add('level_5', 'Оратор 5 уровня')

  if (user.streak.current >= 3) add('streak_3', 'Стабильный оратор')

  const debateStats = user.stats.exerciseStats.find(
    (s) => s.alias === 'ai-debate',
  )
  if (debateStats?.completionsCount >= 5)
    add('ai_debate_5', 'Мастер споров')

  return newAchievements // Возвращаем только новые для уведомления на фронте
}

export { checkAchievements }
