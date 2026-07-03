import React, { useState } from 'react'
import styles from './CourseHistory.module.css'

const CourseHistory = ({ historyList }) => {
  // Храним ID открытых карточек для просмотра развернутого ИИ-анализа
  const [expandedId, setExpandedId] = useState(null)

  if (!historyList || historyList.length === 0) return null

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className={styles.history_container}>
      <h3 className={styles.history_title}>Архив прошлых попыток</h3>
      <div className={styles.timeline}>
        {historyList.map((item, index) => {
          const isCompleted = item.status === 'completed'
          const examData = item.blocksProgress?.exam
          const isExpanded = expandedId === item._id

          return (
            <div
              key={item._id || index}
              className={styles.history_item}
            >
              {/* Шапка архивной карточки */}
              <div
                className={styles.item_header}
                onClick={() => toggleExpand(item._id)}
              >
                <div className={styles.meta_info}>
                  <span className={styles.attempt_number}>
                    Попытка №{historyList.length - index}
                  </span>
                  <span className={styles.finish_date}>
                    {formatDate(item.finishedAt)}
                  </span>
                </div>

                <div className={styles.score_zone}>
                  <span
                    className={`${styles.badge} ${isCompleted ? styles.badge_success : styles.badge_danger}`}
                  >
                    {isCompleted ? 'Успешно' : 'Не сдано'}
                  </span>
                  <span className={styles.score_value}>
                    {examData?.bestScore || 0}{' '}
                    <span className={styles.score_max}>/100</span>
                  </span>
                  <span className={styles.arrow}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Разворачиваемая зона с деталями от ИИ */}
              {isExpanded && (
                <div className={styles.item_details}>
                  <div className={styles.detail_row}>
                    <span>Использовано попыток экзамена:</span>
                    <strong>
                      {examData?.attemptsCount || 0} из 5
                    </strong>
                  </div>
                  {examData?.aiFeedback && (
                    <div className={styles.ai_feedback_block}>
                      <span className={styles.feedback_label}>
                        Сохраненный вердикт ИИ:
                      </span>
                      <p className={styles.feedback_text}>
                        {examData.aiFeedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CourseHistory
