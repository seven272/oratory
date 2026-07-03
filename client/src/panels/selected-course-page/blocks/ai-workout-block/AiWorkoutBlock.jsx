import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubmitAiWorkout } from '../../../../redux/slices/courseSlice'
import styles from './AiWorkoutBlock.module.css'

const WORKOUT_MODES = [
  {
    id: 'investor_pitch',
    title: '🤖 Питч-сессия с жестким инвестором',
    description:
      'Симуляция встречи с венчурным фондом. ИИ будет перебивать, задавать неудобные вопросы о юнит-экономике и проверять вас на стрессоустойчивость.',
    reward: '+50 баллов',
    testScore: 50,
  },
  {
    id: 'elevator_speech',
    title: '⏱️ Элевейтор-питч в лифте',
    description:
      'У вас есть ровно 60 секунд, чтобы донести суть продукта до крупного клиента. Тренажер оценивает лаконичность, отсутствие «воды» и четкость вашего УТП.',
    reward: '+30 баллов',
    testScore: 30,
  },
]

const AiWorkoutBlock = ({ courseCode }) => {
  const dispatch = useDispatch()
  const { error, progressData, courseStatus } = useSelector(
    (state) => state.course,
  )

  const [selectedMode, setSelectedMode] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Извлекаем данные из вашей структуры UserCourseProgressSchema
  const accumulatedScore =
    progressData?.blocksProgress?.aiWorkout?.accumulatedScore || 0
  const sessionsCount =
    progressData?.blocksProgress?.aiWorkout?.sessionsCount || 0
  const REQUIRED_SCORE = 500 // Целевой норматив из модели Course

  // Расчет процента для прогресс-бара очков (не выше 100%)
  const progressPercentage = Math.min(
    (accumulatedScore / REQUIRED_SCORE) * 100,
    100,
  )

  const handleSimulatePass = async (score) => {
    setIsSubmitting(true)
    try {
      await dispatch(
        fetchSubmitAiWorkout({
          courseCode,
          score: score,
        }),
      ).unwrap()
    } catch (err) {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.workout_container}>
      <div className={styles.intro_zone}>
        <h2 className={styles.title}>Доступные ИИ-тренажеры</h2>
        <p className={styles.subtitle}>
          Каждое прохождение приближает вас к цели. Наберите{' '}
          {REQUIRED_SCORE} XP, чтобы открыть доступ к реальному кейсу.
        </p>
      </div>

      {/* 2. Визуальный блок общей шкалы очков за ИИ-этап */}
      <div className={styles.score_progress_card}>
        <div className={styles.score_header}>
          <span className={styles.score_label}>
            Прогресс ИИ-модуля
          </span>
          <span className={styles.score_values}>
            <strong>{accumulatedScore}</strong> / {REQUIRED_SCORE} XP
          </span>
        </div>
        <div className={styles.progress_track}>
          <div
            className={styles.progress_fill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className={styles.score_footer}>
          <span>Попыток совершено: {sessionsCount}</span>
          {progressPercentage >= 100 && (
            <span className={styles.success_text}>
              🎉 Норматив выполнен!
            </span>
          )}
        </div>
      </div>

      <div className={styles.grid_list}>
        {WORKOUT_MODES.map((mode) => {
          const isCurrentSelected = selectedMode === mode.id

          return (
            <div
              key={mode.id}
              className={`${styles.workout_card} ${isCurrentSelected ? styles.card_active : ''}`}
              onClick={() =>
                !isSubmitting && setSelectedMode(mode.id)
              }
            >
              <div className={styles.card_header}>
                <h3 className={styles.card_title}>{mode.title}</h3>
                <span className={styles.reward_badge}>
                  {mode.reward}
                </span>
              </div>
              <p className={styles.card_description}>
                {mode.description}
              </p>

              {isCurrentSelected && (
                <div className={styles.action_zone}>
                  <button
                    className={styles.simulate_button}
                    disabled={
                      isSubmitting || courseStatus === 'loading'
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSimulatePass(mode.testScore)
                    }}
                  >
                    {isSubmitting
                      ? 'Начисление баллов...'
                      : 'Пройти тест-драйв тренажера'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && <div className={styles.error_alert}>{error}</div>}
    </div>
  )
}

export default AiWorkoutBlock
