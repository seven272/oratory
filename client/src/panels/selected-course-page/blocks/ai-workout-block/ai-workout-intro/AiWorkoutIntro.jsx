import React from 'react'
import styles from './AiWorkoutIntro.module.css' // Импорт собственных изолированных стилей

const AiWorkoutIntro = ({
  workoutModes,
  selectedMode,
  setSelectedMode,
  accumulatedScore,
  sessionsCount,
  requiredScore,
  courseStatus,
  onStartTrainer,
}) => {
  const progressPercentage = Math.min(
    (accumulatedScore / requiredScore) * 100,
    100,
  )

  return (
    <>
      <div className={styles.intro_zone}>
        <h2 className={styles.title}>Доступные ИИ-тренажеры</h2>
        <p className={styles.subtitle}>
          Каждое прохождение приближает вас к цели. Наберите{' '}
          {requiredScore} XP, чтобы открыть доступ к реальному кейсу.
        </p>
      </div>

      <div className={styles.score_progress_card}>
        <div className={styles.score_header}>
          <span className={styles.score_label}>
            Прогресс ИИ-модуля
          </span>
          <span className={styles.score_values}>
            <strong>{accumulatedScore}</strong> / {requiredScore} XP
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
        {workoutModes.map((mode) => {
          const isCurrentSelected = selectedMode === mode.id

          return (
            <div
              key={mode.id}
              className={`${styles.workout_card} ${isCurrentSelected ? styles.card_active : ''}`}
              onClick={() =>
                courseStatus !== 'loading' && setSelectedMode(mode.id)
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
                    disabled={courseStatus === 'loading'}
                    onClick={(e) => {
                      e.stopPropagation()
                      onStartTrainer(mode.id)
                    }}
                  >
                    {courseStatus === 'loading'
                      ? 'Запуск симуляции...'
                      : 'Войти в тренажер'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default AiWorkoutIntro
