import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { fetchSubmitIrlReport } from '../../../../redux/slices/courseSlice'
import ChallengeInstructions from './challenge-instructions/ChallengeInstructions'
import ChallengeForm from './challenge-form/ChallengeForm'
import styles from './IrlChallengeBlock.module.css'

const IrlChallengeBlock = ({ courseCode }) => {
  const dispatch = useDispatch()
  const { error, progressData } = useSelector((state) => state.course)

  // Извлекаем уже имеющиеся данные отчета, если пользователь заходил ранее
  const savedReport =
    progressData?.blocksProgress?.irlChallenge?.textReport || ''
  const isCompleted =
    progressData?.blocksProgress?.irlChallenge?.isCompleted || false

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Статические инструкции к заданию (в будущем подтянем из модели Course.irlChallengeData)
  const challengeData = {
    title: '🚀 Задание «В поле»: Запитчи гостя',
    instructions: `Ваша задача — отработать «Правило 3 секунд» на практике. Найдите коллегу, друга или знакомого, который ничего не знает о вашем проекте. 
    У вас есть ровно одна попытка и 30 секунд, чтобы зацепить его внимание без банальных приветствий. 
    
    В поле отчета ниже подробно опишите:
    1. Какую фразу-крючок вы использовали?
    2. Какая была мгновенная реакция собеседника (улыбнулся, отвлекся от телефона, задал встречный вопрос)?
    3. Что бы вы изменили в следующий раз?`,
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
