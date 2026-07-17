import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRestartCourse } from '../../../../../redux/slices/courseSlice'
import styles from './ExamVerdict.module.css'

const ExamVerdict = ({
  courseCode,
  currentScore, // 💡 Новое поле: балл за текущую попытку
  score, // Это лучший балл (bestScore)
  isCompleted,
  attemptsCount,
  aiFeedback,
  isCourseFinished,
  onStartNextAttempt,
}) => {
  const dispatch = useDispatch()
  const { courseStatus } = useSelector((state) => state.course)
  const maxAttempts = 5

  // Логику прохождения текущей попытки завязываем на порог в 85 баллов
  const isCurrentAttemptPassed = currentScore >= 85

  const handleRestart = () => {
    if (
      window.confirm(
        'Вы уверены, что хотите заархивировать текущий результат и пройти курс заново?',
      )
    ) {
      dispatch(fetchRestartCourse(courseCode))
    }
  }

  return (
    <div className={styles.verdict_container}>
      <h2 className={styles.title}>Вердикт ИИ-экзаменатора</h2>

      {/* 📊 Сетка с двумя результатами: текущий и лучший */}
      <div className={styles.stats_grid}>
        <div className={styles.stat_card}>
          <span className={styles.stat_label}>
            Результат текущей попытки
          </span>
          <span
            className={`${styles.score_value} ${isCurrentAttemptPassed ? styles.text_success : styles.text_danger}`}
          >
            {currentScore}{' '}
            <span className={styles.score_max}>/ 100</span>
          </span>
        </div>

        <div className={styles.stat_card}>
          <span className={styles.stat_label}>
            Лучший результат курса
          </span>
          <span
            className={`${styles.score_value} ${score >= 85 ? styles.text_success : ''}`}
          >
            {score} <span className={styles.score_max}>/ 100</span>
          </span>
        </div>
      </div>

      <div className={styles.status_badge_zone}>
        <span
          className={`${styles.score_status} ${isCurrentAttemptPassed ? styles.badge_success : styles.badge_danger}`}
        >
          {isCurrentAttemptPassed
            ? '🎉 Попытка успешно засчитана!'
            : '❌ Текущий порог в 85 баллов не пройден'}
        </span>
      </div>

      <div className={styles.feedback_card}>
        <h4 className={styles.feedback_title}>
          Развернутый анализ ответа
        </h4>
        <p className={styles.feedback_text}>{aiFeedback}</p>
      </div>

      <div className={styles.meta_info}>
        Использовано попыток:{' '}
        <strong>
          {attemptsCount} из {maxAttempts}
        </strong>
      </div>

      {/* Экшн-зона */}
      <div className={styles.action_zone}>
        {isCompleted ? (
          <div className={styles.end_flow_wrapper}>
            <div className={styles.finish_banner}>
              Поздравляем! Обучение успешно завершено, награда
              добавлена в ваш личный профиль.
            </div>
            <button
              className={styles.secondary_restart_btn}
              onClick={handleRestart}
              disabled={courseStatus === 'loading'}
            >
              Пройти курс заново
            </button>
          </div>
        ) : isCourseFinished ? (
          <div className={styles.end_flow_wrapper}>
            <div className={styles.fail_banner}>
              Попытки исчерпаны. Текущее прохождение сохранено в архив
              программы.
            </div>
            <button
              className={styles.restart_btn}
              onClick={handleRestart}
              disabled={courseStatus === 'loading'}
            >
              Попробовать еще раз (сбросить прогресс)
            </button>
          </div>
        ) : (
          <button
            className={styles.next_attempt_btn}
            onClick={onStartNextAttempt}
            disabled={courseStatus === 'loading'}
          >
            Подготовиться к следующей попытке
          </button>
        )}
      </div>
    </div>
  )
}

export default ExamVerdict
