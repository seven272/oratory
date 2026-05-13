import User from '../models/User.js'

const getLeaderboard = async (req, res) => {
  try {
    const currentUserId = req.userId
    const { type } = req.query // 'global' или 'weekly'

    // Определяем правила сортировки и поле для выборки в зависимости от вкладки
    const isWeekly = type === 'weekly'
    const sortQuery = isWeekly
      ? { weeklyXp: -1 }
      : { 'progression.level': -1, 'progression.xp': -1 }

    // 1. Получаем ТОП-10
    const topUsers = await User.find({})
      .sort(sortQuery)
      .limit(10)
      .select(
        'displayName progression.level progression.xp weeklyXp isPremium avatar',
      )

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      displayName: user.displayName || 'Аноним',
      level: user.progression.level,
      score: isWeekly ? user.weeklyXp : user.progression.xp, // Показываем нужные очки
      isPremium: user.isPremium,
      avatar: user.avatar,
    }))

    // 2. Рассчитываем ранг текущего пользователя
    const currentUser = await User.findById(currentUserId)
    if (!currentUser)
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })

    let higherUsersCount = 0

    if (isWeekly) {
      higherUsersCount = await User.countDocuments({
        weeklyXp: { $gt: currentUser.weeklyXp },
      })
    } else {
      higherUsersCount = await User.countDocuments({
        $or: [
          {
            'progression.level': {
              $gt: currentUser.progression.level,
            },
          },
          {
            'progression.level': currentUser.progression.level,
            'progression.xp': { $gt: currentUser.progression.xp },
          },
        ],
      })
    }

    res.status(200).json({
      leaderboard,
      currentUser: {
        rank: higherUsersCount + 1,
        displayName: currentUser.displayName || 'Вы',
        level: currentUser.progression.level,
        score: isWeekly
          ? currentUser.weeklyXp
          : currentUser.progression.xp,
        isPremium: currentUser.isPremium,
        avatar: currentUser.avatar,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка сервера' })
  }
}
export { getLeaderboard }
