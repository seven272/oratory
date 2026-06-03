import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminAnalytics,
  clearAdminState,
} from '../../../redux/slices/adminSlice'
import styles from './StatisticsTotal.module.css'

const StatisticsTotal = () => {
  const dispatch = useDispatch()

  // Селекторы из общего стора (не забудьте подключить adminSlice в configureStore)
  const { analytics, loading, error } = useSelector(
    (state) => state.admin,
  )

  useEffect(() => {
    // Вызов асинхронного экшена через unwrap для контроля цепочки промиса при желании
    dispatch(fetchAdminAnalytics())
      .unwrap()
      .catch((err) => console.error('Ошибка админки:', err))

    // Анмаунт: чистим стейт при выходе из панели
    return () => {
      dispatch(clearAdminState())
    }
  }, [dispatch])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        Загрузка аналитики...
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{ color: 'red', textAlign: 'center', padding: '40px' }}
      >
        {error}
      </div>
    )
  }

  if (!analytics) return null

  const { summary, exercises_analytics, top_purchases } = analytics

  return (
    <div className={styles.admin_container}>
      {/* Верхнеуровневые продуктовые метрики */}
      <div className={styles.stats_grid}>
        <div className={styles.stat_card}>
          <div className={styles.stat_label}>Всего пользователей</div>
          <div className={styles.stat_value}>
            {summary.total_users}
          </div>
        </div>
        <div className={styles.stat_card}>
          <div className={styles.stat_label}>Удерживают стрик</div>
          <div className={styles.stat_value}>
            {summary.active_streaks} чел.
          </div>
        </div>
        <div className={styles.stat_card}>
          <div className={styles.stat_label}>Премиум-аккаунты</div>
          <div className={styles.stat_value}>
            {summary.premium_users_count} ⭐
          </div>
        </div>
        <div className={styles.stat_card}>
          <div className={styles.stat_label}>Конверсия в Premium</div>
          <div className={styles.stat_value}>
            {summary.premium_percentage}%
          </div>
        </div>
        <div className={styles.stat_card}>
          <div className={styles.stat_label}>Средний уровень</div>
          <div className={styles.stat_value}>
            Lvl {summary.avg_level}
          </div>
        </div>
        <div className={styles.stat_card}>
          <div className={styles.stat_label}>Монет в экономике</div>
          <div className={styles.stat_value}>
            {summary.total_coins_in_economy} 🪙
          </div>
        </div>
      </div>

      {/* Активность пользователей в тренажерах */}
      <div className={styles.section_card}>
        <h2 className={styles.section_title}>
          Активность по дням (dailyProgress)
        </h2>
        {exercises_analytics.length === 0 ? (
          <div className={styles.row_meta}>
            Нет данных об упражнениях
          </div>
        ) : (
          exercises_analytics.map((item) => (
            <div key={item._id} className={styles.data_row}>
              <span className={styles.row_name}>{item._id}</span>
              <span className={styles.row_meta}>
                Сессий: <strong>{item.total_sessions || 0}</strong> |
                Ср. балл:{' '}
                <strong>
                  {item.avg_score ? Math.round(item.avg_score) : 0}
                </strong>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Покупки внутриигровых предметов */}
      <div className={styles.section_card}>
        <h2 className={styles.section_title}>
          Популярные покупки (из Inventory)
        </h2>
        {top_purchases.length === 0 ? (
          <div className={styles.row_meta}>
            Покупок пока не совершалось
          </div>
        ) : (
          top_purchases.map((purchase, index) => (
            <div key={index} className={styles.data_row}>
              <span className={styles.row_name}>
                Код товара: <strong>{purchase.item_name}</strong>
              </span>
              <span className={styles.row_meta}>
                Куплено:{' '}
                <strong>{purchase.purchase_count} шт.</strong>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StatisticsTotal
