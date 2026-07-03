import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSubmitExam,
  fetchUnlockExamWithCoins,
} from '../../../../redux/slices/courseSlice'
import ExamResults from './exam-results/ExamResults'
import ExamQuestions from './exam-questions/ExamQuestions'
import ExamVerdict from './exam-verdict/ExamVerdict'
import styles from './ExamBlock.module.css'

const ExamBlock = ({ courseCode }) => {
  const dispatch = useDispatch()

  // Читаем все необходимые данные из единого стейта Redux
  const { error, progressData, courseStatus } = useSelector(
    (state) => state.course,
  )
  const examProgress = progressData?.blocksProgress?.exam

  const bestScore = examProgress?.bestScore || 0
  const isCompleted = examProgress?.isCompleted || false
  const attemptsCount = examProgress?.attemptsCount || 0
  const aiFeedback = examProgress?.aiFeedback || ''
  const lockedUntilStr = examProgress?.lockedUntil

  // Рассчитываем состояние блокировки
  const lockedUntil = lockedUntilStr ? new Date(lockedUntilStr) : null
  const isLocked = lockedUntil && lockedUntil > new Date()

  // Курс завершен окончательно (либо успешно, либо потрачены все 5 попыток)
  const isCourseFinished =
    progressData?.status === 'completed' ||
    progressData?.status === 'failed' ||
    attemptsCount >= 5

  const [examStarted, setExamStarted] = useState(false)
  const isSubmitting = courseStatus === 'loading'

  // Хэндлер отправки аудио на бэкенд (в режиме тестирования логики отправляем выбранный режим)
  const handleAudioSubmit = async ({ testMode }) => {
    try {
      await dispatch(
        fetchSubmitExam({ courseCode, testMode }),
      ).unwrap()
    } catch (err) {
      console.error('Ошибка при отправке экзамена:', err)
    }
  }

  // Хэндлер покупки попытки досрочно
  const handleUnlockWithCoins = async () => {
    try {
      await dispatch(
        fetchUnlockExamWithCoins({ courseCode }),
      ).unwrap()
      alert('Доступ успешно восстановлен!')
    } catch (err) {
      // Ошибка запишется в state.error автоматически и отобразится в UI
      console.error('Ошибка покупки попытки:', err)
    }
  }

  return (
    <div className={styles.exam_container}>
      {/* Экран 1: Временная блокировка (требуется ожидание или монеты) */}
      {isLocked && !isCourseFinished && (
        <div className={styles.locked_card}>
          <h2 className={styles.locked_title}>
            🔒 Доступ временно ограничен
          </h2>
          <p className={styles.locked_text}>
            К сожалению, предыдущая попытка оказалась неудачной. Вы
            можете подождать 24 часа для бесплатного сброса таймера
            или открыть доступ прямо сейчас.
          </p>
          <div className={styles.time_badge}>
            Авто-разблокировка: {lockedUntil.toLocaleString()}
          </div>

          <button
            className={styles.buy_button}
            onClick={handleUnlockWithCoins}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Списание монет...'
              : '✨ Разблокировать за 50 монет'}
          </button>

          {error && <div className={styles.error_alert}>{error}</div>}
        </div>
      )}

      {/* Экран 2: Показываем вердикт ИИ (если блокировки нет, но есть свежий фидбек) */}
      {!isLocked && aiFeedback && (
        <ExamVerdict
          courseCode={courseCode}
          score={bestScore}
          isCompleted={isCompleted}
          attemptsCount={attemptsCount}
          aiFeedback={aiFeedback}
          isCourseFinished={isCourseFinished}
          onStartNextAttempt={() => setExamStarted(true)}
        />
      )}

      {/* Экран 3: Начальный экран (тестирование еще не запущено и нет активного фидбека) */}
      {!isLocked && !aiFeedback && !examStarted && (
        <ExamResults
          bestScore={bestScore}
          isCompleted={isCompleted}
          isCourseFinished={isCourseFinished}
          attemptsCount={attemptsCount}
          onStart={() => setExamStarted(true)}
        />
      )}

      {/* Экран 4: Интерактивный аудио-рекордер (процесс сдачи экзамена) */}
      {!isLocked && !aiFeedback && examStarted && (
        <ExamQuestions
          attemptsCount={attemptsCount}
          isSubmitting={isSubmitting}
          onSubmit={handleAudioSubmit}
          onCancel={() => setExamStarted(false)}
        />
      )}

      {/* Вывод глобальных серверных ошибок под экранами рекордера или результатов */}
      {error && !isLocked && (
        <div className={styles.error_alert}>{error}</div>
      )}
    </div>
  )
}

export default ExamBlock
