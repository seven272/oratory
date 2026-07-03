import React from 'react'
import styles from './ExamResults.module.css'

const ExamResults = ({
  bestScore,
  isCompleted,
  attemptsCount,
  onStart,
}) => {
  const maxAttempts = 5
  const hasNoAttempts = attemptsCount >= maxAttempts && !isCompleted

  // Выносим определение статуса для чистоты рендера
  const badgeClass = isCompleted
    ? styles.badge_success
    : hasNoAttempts
      ? styles.badge_danger
      : styles.badge_neutral

  const badgeText = isCompleted
    ? 'Курс пройден'
    : hasNoAttempts
      ? 'Попытки исчерпаны'
      : 'Финальный этап'

  return (
    <div className={styles.results_container}>
      <div className={styles.meta_zone}>
        <span className={badgeClass}>{badgeText}</span>
      </div>

      <h2 className={styles.title}>Итоговый аудио-экзамен</h2>
      <p className={styles.description}>
        Запишите устный ответ на практический кейс длительностью от 60
        до 120 секунд. Для успешной сдачи наберите{' '}
        <strong>минимум 85 баллов из 100</strong>.
      </p>

      {/* Современный блок метрик без лишних рамок */}
      <div className={styles.stats_grid}>
        <div className={styles.stat_card}>
          <span className={styles.stat_label}>Лучший результат</span>
          <span
            className={`${styles.stat_value} ${bestScore >= 85 ? styles.text_success : ''}`}
          >
            {bestScore} <span className={styles.stat_max}>/ 100</span>
          </span>
        </div>

        <div className={styles.stat_card}>
          <span className={styles.stat_label}>
            Использовано попыток
          </span>
          <span className={styles.stat_value}>
            {attemptsCount}{' '}
            <span className={styles.stat_max}>из {maxAttempts}</span>
          </span>
        </div>
      </div>

      {/* Экшн-зона */}
      <div className={styles.action_zone}>
        {isCompleted ? (
          <div className={styles.finished_banner}>
            Поздравляем! Обучение успешно завершено, доступ к
            материалам остается открытым.
          </div>
        ) : hasNoAttempts ? (
          <div className={styles.danger_banner}>
            Вы использовали все доступные попытки. Обратитесь к
            куратору для открытия дополнительного слота.
          </div>
        ) : (
          <button className={styles.start_button} onClick={onStart}>
            {attemptsCount > 0
              ? `Начать попытку №${attemptsCount + 1}`
              : 'Начать тестирование'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ExamResults
