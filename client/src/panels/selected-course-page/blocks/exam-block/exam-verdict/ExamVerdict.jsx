import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchRestartCourse } from '../../../../../redux/slices/courseSlice'
import styles from './ExamVerdict.module.css'

const ExamVerdict = ({
  courseCode,
  score,
  isCompleted,
  attemptsCount,
  aiFeedback,
  isCourseFinished,
  onStartNextAttempt,
}) => {
  const dispatch = useDispatch()
  const { courseStatus } = useSelector((state) => state.course)
  const maxAttempts = 5

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

      <div className={styles.score_zone}>
        <span
          className={`${styles.score_value} ${isCompleted ? styles.text_success : styles.text_danger}`}
        >
          {score} <span className={styles.score_max}>/ 100</span>
        </span>
        <span className={styles.score_status}>
          {isCompleted
            ? 'Экзамен успешно сдан'
            : 'Порог в 85 баллов не пройден'}
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
              Поздравляем! Курс успешно завершен, награда добавлена в
              ваш личный профиль.
            </div>
            {/* 💡 Добавляем кнопку вторичного стиля для успешного рестарта */}
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
            {/* 💡 Для заваливших это главная кнопка — делаем её акцентной */}
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
