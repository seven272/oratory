import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { fetchSubmitIrlReport } from '../../../../redux/slices/courseSlice'
import ChallengeInstructions from './challenge-instructions/ChallengeInstructions'
import ChallengeForm from './challenge-form/ChallengeForm'
import styles from './IrlChallengeBlock.module.css'
import { COURSES_STATIC_CONTENT } from '../../../../assets/data/courses/coursesContent'

const IrlChallengeBlock = ({ courseCode }) => {
  const dispatch = useDispatch()
  const { error, progressData } = useSelector((state) => state.course)

  // Извлекаем уже имеющиеся данные отчета, если пользователь заходил ранее
  const savedReport =
    progressData?.blocksProgress?.irlChallenge?.textReport || ''
  const isCompleted =
    progressData?.blocksProgress?.irlChallenge?.isCompleted || false
  const [isSubmitting, setIsSubmitting] = useState(false)

  const courseStatic = COURSES_STATIC_CONTENT[courseCode]
  const irlStatic = courseStatic?.irl_challenge

  const challengeData = {
    title: irlStatic?.title || '🎯 Задание в реальном мире',
    instructions:
      irlStatic?.instructions ||
      'Выполните практическое задание курса.',
  }

  const handleSubmitReport = async (textReport) => {
    if (!textReport.trim()) return
    setIsSubmitting(true)
    try {
      console.log(
        'Отправка отчета по курсу:',
        courseCode,
        'Текст:',
        textReport,
      )
      // Имитируем задержку запроса к бэкенду
      await new Promise((resolve) => setTimeout(resolve, 1500))

      await dispatch(
        fetchSubmitIrlReport({ courseCode, textReport }),
      ).unwrap()
      message.success('Отчет успешно отправлен на проверку ИИ!')
    } catch (err) {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.challenge_container}>
      <ChallengeInstructions data={challengeData} />

      <ChallengeForm
        savedReport={savedReport}
        isCompleted={isCompleted}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmitReport}
      />

      {error && <div className={styles.error_alert}>{error}</div>}
    </div>
  )
}

export default IrlChallengeBlock
