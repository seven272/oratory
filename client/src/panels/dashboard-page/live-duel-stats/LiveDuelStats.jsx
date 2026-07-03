import React from 'react'
import { Progress } from 'antd'
import {
  StarOutlined,
  CrownOutlined,
  TeamOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import styles from './LiveDuelStats.module.css'

const LiveDuelStats = ({ duelStats }) => {
  if (!duelStats) return null

  // Преобразуем объект распределения оценок {1: X, 2: Y...} в отсортированный массив
  const distributionArray = Object.entries(duelStats.distribution)
    .map(([stars, count]) => ({ stars: Number(stars), count }))
    .sort((a, b) => b.stars - a.stars) // 5 звезд сверху

  // Вычисляем общее количество оценок для расчета процентов полосы
  const totalRatingsCount = Object.values(
    duelStats.distribution,
  ).reduce((a, b) => a + b, 0)

  return (
    <>
      {/* Заголовок секции */}
      <h3 className={styles.section_divider_title}>
        <TeamOutlined /> Живые дуэли
      </h3>

      {/* Мини-сетка карточек дуэлей */}
      <div className={styles.stats_grid}>
        {/* Карточка количества встреч */}
        <div className={styles.card}>
          <div className={styles.stat_header}>
            <TeamOutlined className={styles.icon_duels_count} />
            <span className={styles.stat_title}>Всего дуэлей</span>
          </div>
          <div className={styles.stat_value}>
            {duelStats.totalRooms}
          </div>
          <div className={styles.stat_sub}>
            Фидбек: {duelStats.feedbackRate}% комнат
          </div>
        </div>
        {/* Карточка рейтинга */}
        <div className={styles.card}>
          <div className={styles.stat_header}>
            <CrownOutlined className={styles.icon_rating} />
            <span className={styles.stat_title}>Средний балл</span>
          </div>
          <div className={styles.stat_value}>
            {duelStats.averageRating.toFixed(1)}{' '}
            <span className={styles.star_mini}>
              <StarOutlined />
            </span>
          </div>
          <div className={styles.stat_sub}>
            На основе оценок оппонентов
          </div>
        </div>
      </div>

      {/* Гистограмма распределения (показываем, только если есть сыгранные комнаты) */}
      {duelStats.totalRooms > 0 && (
        <div className={styles.card}>
          <h3 className={styles.card_title}>Распределение оценок</h3>
          <div className={styles.distribution_list}>
            {distributionArray.map(({ stars, count }) => {
              const percent =
                totalRatingsCount > 0
                  ? Math.round((count / totalRatingsCount) * 100)
                  : 0

              return (
                <div key={stars} className={styles.distribution_row}>
                  <div className={styles.dist_label}>
                    {stars}{' '}
                    <StarOutlined
                      style={{ color: '#fadb14', fontSize: '12px' }}
                    />
                  </div>
                  <div className={styles.dist_progress}>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      strokeColor="#fadb14"
                      trailColor="#f5f5f5"
                      size={['100%', 8]}
                    />
                  </div>
                  <div className={styles.dist_count}>{count}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* История последних поединков */}
      <div className={`${styles.card} ${styles.activity_area}`}>
        <h3 className={styles.card_title}>
          <MessageOutlined /> Последняя дуэль
        </h3>
        <div className={styles.activity_list}>
          {duelStats.history.length === 0 ? (
            <div className={styles.empty_text}>
              Вы еще не участвовали в дуэлях
            </div>
          ) : (
            duelStats.history.map((item, index) => (
              <div key={index} className={styles.activity_item}>
                <div className={styles.activity_info}>
                  <div className={styles.activity_name}>
                    {item.topic || 'Без темы'}
                  </div>
                  <div className={styles.activity_score}>
                    {item.date
                      ? new Date(item.date).toLocaleDateString(
                          'ru-RU',
                        )
                      : ''}
                  </div>
                </div>
                <div className={styles.activity_count}>
                  {item.rating !== null ? (
                    <>
                      <StarOutlined style={{ color: '#fadb14' }} />{' '}
                      {item.rating}
                    </>
                  ) : (
                    <span className={styles.no_rating}>
                      Без оценки
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default LiveDuelStats
