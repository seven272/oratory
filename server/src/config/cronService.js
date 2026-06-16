import cron from 'node-cron'
import User from '../models/User.js'
import UserChallenge from '../models/UserChallenge.js'
import LiveRoom from '../models/LiveRoom.js'

const initCronJobs = () => {
  // Выражение '0 0 * * 1' означает: Ровно в 00:00, каждый понедельник (1)
  cron.schedule(
    '0 0 * * 1',
    async () => {
      console.log(
        '⏳ [Cron]: Запуск автоматического сброса недельного рейтинга...',
      )

      try {
        // Массово обновляем всех пользователей, устанавливая weeklyXp в 0
        const result = await User.updateMany(
          {},
          { $set: { weeklyXp: 0 } },
        )

        console.log(
          `✅ [Cron]: Недельный рейтинг успешно сброшен. Обновлено пользователей: ${result.modifiedCount}`,
        )

        // 2. 🔥 Очищаем таблицу выполненных челленджей, делая их доступными заново
        const challengeResult = await UserChallenge.deleteMany({})
        console.log(
          `✅ [Cron]: Статусы еженедельных челленджей очищены. Удалено записей: ${challengeResult.deletedCount}`,
        )
      } catch (error) {
        console.error(
          '❌ [Cron]: Ошибка при сбросе недельного рейтинга:',
          error,
        )
      }
    },
    {
      scheduled: true,
      timezone: 'Europe/Moscow', // Установите часовой пояс вашего основного пула пользователей
    },
  )

  // НОВЫЙ КРОН: Запуск каждые 30 минут для очистки "протухших" комнат дуэлей
  cron.schedule('*/30 * * * *', async () => {
    try {
      const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000)

      // Отменяем комнаты быстрого поиска или ссылок, которые висят в pending дольше 30 минут
      const result = await LiveRoom.updateMany(
        {
          status: 'pending',
          created_at: { $lt: halfHourAgo },
        },
        { $set: { status: 'canceled' } },
      )

      console.log(
        `[Cron Log]: Очищено заброшенных комнат: ${result.modifiedCount}`,
      )
    } catch (error) {
      console.error('[Cron Error]: Ошибка при очистке комнат:', error)
    }
  })
}

export { initCronJobs }
