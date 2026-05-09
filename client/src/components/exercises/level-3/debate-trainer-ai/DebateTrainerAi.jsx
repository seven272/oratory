import React, { useState, useEffect } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ScreenSpinner } from '@vkontakte/vkui'
import { useDispatch, useSelector } from 'react-redux'

import {
  SCREEN_STATUS,
  AI_STATUS,
} from '../../../../constants/exercises'
import { aiDebateSnenarios } from '../../../../assets/mocks/aiData'
import { getRandomObjTask } from '../../../../utils/getRandomObjTask'
import DebateIdle from './debate-idle/DebateIdle'
import DebateProcess from './debate-process/DebateProcess'
import DebateResult from './debate-result/DebateResult'
import styles from './DebateTrainerAi.module.css'
import { useSpeech } from '../../../../hooks/useSpeech'
import {
  setActiveExercise,
  resetExerciseState,
  setAiStatus,
  fetchStartDebate,
  fetchSendUserResponseDebate,
  fetchFinishDebate,
} from '../../../../redux/slices/aiExerciseSlice'
import TheoryContent from '../../../theory-content/TheoryContent'
import Modal from '../../../../UI/modal/Modal'

const EXERCISE_NAME = 'debate'
const TOTAL_ROUNDS = 3
const TIME_ROUND = 15

const isSpeechSupported = !!(
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)
)

const DebateTrainerAi = ({ alias }) => {
  const {
    transcript,
    startListening,
    stopListening,
    isListening,
    resetTranscript,
  } = useSpeech('ru-RU')
  const dispatch = useDispatch()
  const routerNavigator = useRouteNavigator()
  // --- СОСТОЯНИЕ КОМПОНЕНТА (ТОЛЬКО UI-состояние) ---
  const [randomTopic, setRandomTopic] = useState(null)
  const [poolTopic, setPoolTopic] = useState([])
  const [userPosition, setUserPosition] = useState('')
  const [userTopic, setUserTopic] = useState('')
  const [screenStatus, setScreenStatus] = useState(SCREEN_STATUS.IDLE)
  const [showModal, setShowModal] = useState(false)

  // --- СОСТОЯНИЕ ИЗ REDUX (ГЛОБАЛЬНОЕ) ---
  const exerciseState = useSelector(
    (state) => state.aiExercise.exercises.debate,
  )
  const { messages, exStatus, aiStatus } = exerciseState
  const isLoading = exStatus === 'loading'

  // Инициализация темы дебатов
  useEffect(() => {
    const { selectedItem, newPool } = getRandomObjTask(
      [],
      aiDebateSnenarios,
    )
    setRandomTopic(selectedItem)
    setPoolTopic(newPool)
    setUserTopic(selectedItem.topic)
    dispatch(setActiveExercise(EXERCISE_NAME))
    // Очистка при размонтировании компонента
    return () => {
      dispatch(resetExerciseState(EXERCISE_NAME))
    }
  }, [dispatch])

  const handleStartDebate = () => {
    if (!userTopic || !userPosition) return
    dispatch(
      fetchStartDebate({ topic: userTopic, position: userPosition }),
    )
    setScreenStatus(SCREEN_STATUS.RUNNING)
  }

  const handleSendUserResponse = (userText) => {
    if (!userText.trim() || isLoading) return

    dispatch(
      fetchSendUserResponseDebate({
        topic: userTopic,
        position: userPosition,
        userMessage: userText,
      }),
    )
    // resetTranscript(); // Очистку речи можно оставить здесь или в хуке useEffect выше
  }

  const handleStartRecording = () => {
    resetTranscript() // Очистить старый текст
    // Переключаем статус, чтобы UI мгновенно отобразил пульсацию и счетчик
    dispatch(setAiStatus(AI_STATUS.RECORDING))
    startListening()
  }

  const handleStopRecording = () => {
    // 1. Останавливаем микрофон (это вызовет setIsListening(false) внутри хука)
    stopListening()
    // 2. Берем финальный текст или заглушку
    const userText = transcript.trim() || 'Мне нечего сказать'

    setTimeout(() => {
      // 3. Ставим статус "ИИ думает"
      dispatch(setAiStatus(AI_STATUS.AI_THINKING))

      // 4. Отправляем на сервер
      dispatch(
        fetchSendUserResponseDebate({
          topic: userTopic,
          position: userPosition,
          userMessage: userText,
        }),
      ).then(() => {
        // 5. Очищаем текст в хуке после успешного или неуспешного диспатча
        resetTranscript()
      })
    }, 600)
  }

  const handleFinishDebate = () => {
    // меняем экран на финальный
    setScreenStatus(SCREEN_STATUS.FINISHED)
    // диспатч на получение оценки,
    dispatch(fetchFinishDebate())
  }

  const handleAutoSubmit = () => {
    const userText = transcript || 'Пропуск хода (время истекло)'
    handleSendUserResponse(userText)
  }

  const handleRefreshTopic = () => {
    const { selectedItem, newPool } = getRandomObjTask(
      poolTopic,
      aiDebateSnenarios,
    )
    setRandomTopic(selectedItem)
    setPoolTopic(newPool)
    setUserTopic(selectedItem.topic)
    setUserPosition('')
    // При смене темы сбрасываем состояние упражнения в сторе
    dispatch(resetExerciseState(EXERCISE_NAME))
  }

  const handleCloseExercise = () => {
    dispatch(resetExerciseState(EXERCISE_NAME))
    routerNavigator.push('/')
  }

  if (!randomTopic) return <ScreenSpinner />

  return (
    <div className={styles.main_debate}>
      <h2 className={styles.title}>Дебат-клуб</h2>
      <p className={styles.descr}>
        Докажи свою точку зрезиня в споре с ИИ
      </p>

      <div className={styles.screen}>
        {screenStatus === SCREEN_STATUS.IDLE && (
          <DebateIdle
            onRefreshTopic={() => handleRefreshTopic()}
            onShowTheory={() => setShowModal(true)}
            topicData={randomTopic}
            userPosition={userPosition}
            onPositionSelect={setUserPosition}
            onStartDebate={handleStartDebate}
          />
        )}

        {screenStatus === SCREEN_STATUS.RUNNING && (
          <DebateProcess
            numberRounds={TOTAL_ROUNDS}
            topic={userTopic}
            messages={messages}
            timeLimit={TIME_ROUND}
            aiStatus={aiStatus}
            onStopRecording={handleStopRecording}
            onStartRecording={handleStartRecording}
            onFinishDebate={handleFinishDebate}
            onAutoFinish={handleAutoSubmit}
            isAiThinking={isLoading}
          />
        )}

        {screenStatus === SCREEN_STATUS.FINISHED && (
          <DebateResult onCloseExercise={handleCloseExercise} />
        )}
      </div>
      <Modal active={showModal} onClose={() => setShowModal(false)}>
        <TheoryContent
          alias={alias}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default DebateTrainerAi
