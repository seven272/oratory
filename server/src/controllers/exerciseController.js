import User from '../models/User.js'
import DailyChallenge from '../models/DailyChallenge.js'
import DailyTask from '../models/DailyTask.js'

import { All_EXERCISES } from '../constants/exercises.js'
import { getXpThreshold } from '../utils/fnForControllers.js'
import { checkAchievements } from '../utils/achievementService.js'

// const completeExercise = async (req, res) => {
//   try {
//     const { exAlias, score } = req.body
//     const userId = req.userId

//     // 1. Поиск конфига упражнения
//     const exercise = Object.values(All_EXERCISES)
//       .flat()
//       .find((ex) => ex.alias === exAlias)
//     if (!exercise)
//       return res
//         .status(404)
//         .json({ message: 'Упражнение не найдено' })

//     const user = await User.findById(userId)
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: 'Пользователь не найден' })

//     //Логика Стрика (Дисциплины)
//     const now = new Date()
//     const today = new Date(now).setUTCHours(0, 0, 0, 0) // Сегодня 00:00 UTC

//     const lastDateRaw = user.streak.lastCompletedDate
//     const lastDate = lastDateRaw
//       ? new Date(lastDateRaw).setUTCHours(0, 0, 0, 0)
//       : null

//     const oneDayInMs = 86400000

//     if (!lastDate) {
//       user.streak.current = 1 // Первый раз в приложении
//     } else if (today === lastDate + oneDayInMs) {
//       user.streak.current += 1 // Занимался вчера
//     } else if (today > lastDate + oneDayInMs) {
//       user.streak.current = 1 // Пропустил день — сброс в 1
//     }
//     // Если сегодня уже занимался (today === lastDate), стрик не трогаем
//     user.streak.lastCompletedDate = now // Сохраняем точный момент выполнения

//     // Расчет наград (XP и Coins)
//     let multiplier = 1
//     if (user.streak.current >= 3) multiplier = 1.2
//     if (user.streak.current >= 7) multiplier = 1.5

//     const earnedXp = Math.round(score * multiplier)

//     //  Начисляем в глобальный счетчик (никогда не сбрасывается)
//     user.stats.lifetimeXp += earnedXp

//     //  Начисляем в текущий уровень (будет сбрасываться при Level Up)
//     user.progression.xp += earnedXp

//     // Начисляем 1 жетон за каждые 10 единиц опыта
//     const earnedCoins = Math.floor(earnedXp / 10)
//     user.progression.coins += earnedCoins

//     // Проверка Level Up. Делаем проверку до тех пор пока текущее кол-во очков не станет больше значения для соответсвующего уровня, если станет больше увеличиваем уровень на 1
//     let isLevelUp = false
//     while (
//       user.progression.xp >= getXpThreshold(user.progression.level)
//     ) {
//       const currentThreshold = getXpThreshold(user.progression.level)
//       user.progression.xp -= currentThreshold
//       user.progression.level += 1
//       isLevelUp = true
//     }

//     // Обновление статистики (stats.exerciseStats)
//     const statIndex = user.stats.exerciseStats.findIndex(
//       (ex) => ex.alias === exAlias,
//     )

//     if (statIndex > -1) {
//       const currentStat = user.stats.exerciseStats[statIndex]
//       currentStat.totalPoints += score
//       currentStat.completionsCount += 1
//     } else {
//       user.stats.exerciseStats.push({
//         alias: exAlias,
//         title: exercise.title,
//         totalPoints: score,
//         completionsCount: 1,
//       })
//     }

//     user.stats.totalExercises = (user.stats.totalExercises || 0) + 1

//     await user.save()

//     res.status(200).json({
//       message: 'Прогресс сохранен',
//       earnedXp,
//       isLevelUp, //сообщаем фронту, что уровень пользователя вырос
//       stats: {
//         level: user.progression.level,
//         xp: user.progression.xp,
//         coins: user.progression.coins,
//         streak: user.streak.current,
//         nextThreshold: getXpThreshold(user.progression.level),
//       },
//     })
//   } catch (error) {
//     console.error(error)
//     res
//       .status(500)
//       .json({ message: 'Ошибка при сохранении результата' })
//   }
// }

const completeExercise = async (req, res) => {
  try {
    const { exAlias, score, isDaily } = req.body // Добавляем флаг из запроса
    const userId = req.userId
    const todayStr = new Date().toISOString().split('T')[0] // Для поиска в dailyProgress

    const exercise = Object.values(All_EXERCISES)
      .flat()
      .find((ex) => ex.alias === exAlias)
    if (!exercise)
      return res
        .status(404)
        .json({ message: 'Упражнение не найдено' })

    const user = await User.findById(userId)
    if (!user)
      return res
        .status(404)
        .json({ message: 'Пользователь не найден' })

    // --- ЛОГИКА DAILY CHALLENGE ---
    let dailyBonusXp = 0
    let dailyBonusCoins = 0

    if (isDaily) {
      const dailySet = await DailyChallenge.findOne({
        date: todayStr,
      }).populate('tasks')
      const currentTask = dailySet?.tasks.find(
        (t) => t.alias === exAlias,
      )

      if (currentTask) {
        let pIndex = user.dailyProgress.findIndex(
          (p) =>
            p.taskId.toString() === currentTask._id.toString() &&
            p.date === todayStr,
        )

        if (pIndex === -1) {
          user.dailyProgress.push({
            taskId: currentTask._id,
            currentValue: 1,
            date: todayStr,
            isCompleted: currentTask.goal <= 1,
          })
          pIndex = user.dailyProgress.length - 1
        } else if (!user.dailyProgress[pIndex].isCompleted) {
          user.dailyProgress[pIndex].currentValue += 1
          if (
            user.dailyProgress[pIndex].currentValue >=
            currentTask.goal
          ) {
            user.dailyProgress[pIndex].isCompleted = true
          }
        }

        // Если задание завершено именно сейчас — готовим бонусы
        if (
          user.dailyProgress[pIndex].isCompleted &&
          user.dailyProgress[pIndex].currentValue === currentTask.goal
        ) {
          dailyBonusXp = currentTask.reward
          dailyBonusCoins = 10

          // --- ЛОГИКА СТРИКА (теперь только здесь) ---
          const now = new Date()
          const todayMs = new Date(now).setUTCHours(0, 0, 0, 0)
          const lastDate = user.streak.lastCompletedDate
            ? new Date(user.streak.lastCompletedDate).setUTCHours(
                0,
                0,
                0,
                0,
              )
            : null
          const oneDayInMs = 86400000

          if (!lastDate) {
            user.streak.current = 1
          } else if (todayMs === lastDate + oneDayInMs) {
            user.streak.current += 1
          } else if (todayMs > lastDate + oneDayInMs) {
            user.streak.current = 1
          }
          user.streak.lastCompletedDate = now
        }
      }
    }

    // --- РАСЧЕТ НАГРАД ---
    let multiplier = 1
    if (user.streak.current >= 3) multiplier = 1.2
    if (user.streak.current >= 7) multiplier = 1.5

    // Итоговый опыт = (Опыт за очки * множитель стрика) + бонус за дейлик
    const earnedXp = Math.round(score * multiplier) + dailyBonusXp
    const earnedCoins =
      Math.floor(Math.round(score * multiplier) / 10) +
      dailyBonusCoins

    user.stats.lifetimeXp += earnedXp
    user.progression.xp += earnedXp
    user.progression.coins += earnedCoins

    // --- LEVEL UP ---
    let isLevelUp = false
    while (
      user.progression.xp >= getXpThreshold(user.progression.level)
    ) {
      user.progression.xp -= getXpThreshold(user.progression.level)
      user.progression.level += 1
      isLevelUp = true
    }

    // --- СТАТИСТИКА УПРАЖНЕНИЯ ---
    const statIndex = user.stats.exerciseStats.findIndex(
      (ex) => ex.alias === exAlias,
    )
    if (statIndex > -1) {
      user.stats.exerciseStats[statIndex].totalPoints += score
      user.stats.exerciseStats[statIndex].completionsCount += 1
    } else {
      user.stats.exerciseStats.push({
        alias: exAlias,
        title: exercise.title,
        totalPoints: score,
        completionsCount: 1,
      })
    }
    user.stats.totalExercises = (user.stats.totalExercises || 0) + 1

    //проверка на получение новых достижений
    const newAwards = checkAchievements(user)

    await user.save()

    res.status(200).json({
      message: 'Прогресс сохранен',
      earnedXp,
      earnedCoins,
      isLevelUp,
      newAchievements: newAwards || [],
      stats: {
        level: user.progression.level,
        xp: user.progression.xp,
        coins: user.progression.coins,
        streak: user.streak.current,
        nextThreshold: getXpThreshold(user.progression.level),
      },
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Ошибка при сохранении результата' })
  }
}

const getDailyTasks = async (req, res) => {
  try {
    const userId = req.userId
    const today = new Date().toISOString().split('T')[0] // Формат "2023-10-27"

    // 1. Ищем, определены ли общие задачи на сегодня
    let challenge = await DailyChallenge.findOne({
      date: today,
    }).populate('tasks')

    // 2. Если на сегодня задач еще нет (первый юзер зашел в систему) — генерируем
    if (!challenge) {
      const [t1] = await DailyTask.aggregate([
        //aggregate всегда возвращает массив, даже если выбрана одна
        { $match: { level: 1 } }, // Этап 1: Фильтрация ($match)
        { $sample: { size: 1 } }, // Этап 2: Случайный выбор ($sample)
      ])
      const [t2] = await DailyTask.aggregate([
        { $match: { level: 2 } },
        { $sample: { size: 1 } },
      ])
      const [t3] = await DailyTask.aggregate([
        { $match: { level: 3 } },
        { $sample: { size: 1 } },
      ])

      challenge = await DailyChallenge.create({
        date: today,
        tasks: [t1._id, t2._id, t3._id],
      })

      // Снова подтягиваем данные после создания
      challenge = await DailyChallenge.findById(
        challenge._id,
      ).populate('tasks')
    }

    // 3. Получаем данные пользователя для проверки прогресса и премиума
    const user = await User.findById(userId)

    // 4. Формируем ответ, совмещая данные задачи и личный прогресс юзера
    const tasksWithProgress = challenge.tasks.map((task) => {
      const userProgress = user.dailyProgress.find(
        (p) =>
          p.taskId.toString() === task._id.toString() &&
          p.date === today,
      )

      return {
        ...task._doc,
        // Блокируем Level 3, если нет премиума
        locked: task.level === 3 && !user.isPremium,
        // Передаем текущий прогресс
        currentValue: userProgress ? userProgress.currentValue : 0,
        isCompleted: userProgress ? userProgress.isCompleted : false,
      }
    })

    res.json({
      date: today,
      tasks: tasksWithProgress,
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Ошибка получения ежедневных заданий' })
  }
}

export { completeExercise, getDailyTasks }
