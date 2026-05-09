// controllers/dailyController.js
import DailyTask from '../models/DailyTask.js'
import DailyChallenge from '../models/DailyChallenge.js'

 const getDailyTasks = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0] // "2023-10-27"

    // 1. Ищем, определены ли задачи на сегодня
    let challenge = await DailyChallenge.findOne({
      date: today,
    }).populate('tasks')

    // 2. Если нет — генерируем новый набор
    if (!challenge) {
      const taskLvl1 = await DailyTask.aggregate([
        //aggregate всегда возвращает массив, даже если выбрана одна
        { $match: { level: 1 } }, // Этап 1: Фильтрация ($match)
        { $sample: { size: 1 } }, // Этап 2: Случайный выбор ($sample)
      ])
      const taskLvl2 = await DailyTask.aggregate([
        { $match: { level: 2 } },
        { $sample: { size: 1 } },
      ])
      const taskLvl3 = await DailyTask.aggregate([
        { $match: { level: 3 } },
        { $sample: { size: 1 } },
      ])

      challenge = await DailyChallenge.create({
        date: today,
        tasks: [taskLvl1[0]._id, taskLvl2[0]._id, taskLvl3[0]._id],
      })

      // Наполняем данными для ответа
      challenge = await challenge.populate('tasks')
    }

    // 3. Отдаем фронтенду, помечая доступность
    const userIsPremium = req.user.isPremium // Берем из middleware авторизации

    const response = challenge.tasks.map((task) => ({
      ...task._doc,
      locked: task.level === 3 && !userIsPremium, // Блокируем Lvl 3 для не-премиумов
    }))

    res.json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Ошибка при получении заданий' })
  }
}
