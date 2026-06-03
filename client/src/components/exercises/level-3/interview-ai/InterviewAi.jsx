import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ScreenSpinner } from '@vkontakte/vkui'
import { useDispatch, useSelector } from 'react-redux'

import styles from './InterviewAi.module.css'
import { aiInterviewSnenarios } from '../../../../assets/mocks/aiData'
import { getRandomObjTask } from '../../../../utils/getRandomObjTask'
import InterviewIdle from './interview-idle/InterviewIdle'
import InterviewProcess from './interview-process/InterviewProcess'
import InterviewResult from './interview-result/InterviewResult'
import { useSpeech } from '../../../../hooks/useSpeech'
import {
  SCREEN_STATUS,
  AI_STATUS,
} from '../../../../constants/exercises'
import {
  setActiveExercise,
  resetExerciseState,
  setAiStatus,
  fetchStartInterview,
  fetchResponseInterview,
  fetchFinishInterview,
} from '../../../../redux/slices/aiExerciseSlice'
import TheoryContent from '../../../theory-content/TheoryContent'
import Modal from '../../../../UI/modal/Modal'

const EXERCISE_NAME = 'interview'
const TOTAL_ROUNDS = 3
const TIME_ROUND = 15

// const isSpeechSupported = !!(
//   typeof window !== 'undefined' &&
//   (window.SpeechRecognition || window.webkitSpeechRecognition)
// )

const InterviewAi = ({ alias, isDaily }) => {
  const {
    transcript,
    startListening,
    stopListening,
    // isListening,
    resetTranscript,
  } = useSpeech('ru-RU')
  const dispatch = useDispatch()
  const routerNavigator = useRouteNavigator()
  // --- СОСТОЯНИЕ КОМПОНЕНТА (ТОЛЬКО UI-состояние) ---
  const [randomInterview, setRandomInterview] = useState(null)
  const [poolInterview, setPoolInterview] = useState([])
  const [screenStatus, setScreenStatus] = useState(SCREEN_STATUS.IDLE)
  const [showModal, setShowModal] = useState(false)

  // --- СОСТОЯНИЕ ИЗ REDUX (ГЛОБАЛЬНОЕ) ---
  const exerciseState = useSelector(
    (state) => state.aiExercise.exercises.interview,
  )
  const { messages, exStatus, aiStatus } = exerciseState
  const isLoading = exStatus === 'loading'

  // Инициализация темы интервью
  useEffect(() => {
    const { selectedItem, newPool } = getRandomObjTask(
      [],
      aiInterviewSnenarios,
    )
    setRandomInterview(selectedItem)
    setPoolInterview(newPool)
    dispatch(setActiveExercise(EXERCISE_NAME))
    // Очистка при размонтировании компонента
    return () => {
      dispatch(resetExerciseState(EXERCISE_NAME))
    }
  }, [dispatch])

  const handleStartInerview = () => {
    if (!randomInterview) return
    dispatch(fetchStartInterview(randomInterview))
    setScreenStatus(SCREEN_STATUS.RUNNING)
  }

  const handleSendUserResponse = (userText) => {
    if (!userText.trim() || isLoading) return

    dispatch(
      fetchResponseInterview({
        interviewData: randomInterview,
        userMessage: userText,
      }),
    )
    // resetTranscript(); // Очистку речи можно оставить здесь или при старте нового интервью
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
        fetchResponseInterview({
          interviewData: randomInterview,
          userMessage: userText,
        }),
      ).then(() => {
        // 5. Очищаем текст в хуке после успешного или неуспешного диспатча
        resetTranscript()
      })
    }, 100)
  }

  const handleFinishExercise = () => {
    // меняем экран на финальный
    setScreenStatus(SCREEN_STATUS.FINISHED)
    // диспатч на получение оценки,
    dispatch(fetchFinishInterview({ isDaily }))
  }

  const handleAutoSubmit = () => {
    const userText =
      transcript ||
      'Вы нечего не сказали. Пропуск хода (время истекло)'
    handleSendUserResponse(userText)
  }

  const handleRefreshTopic = () => {
    const { selectedItem, newPool } = getRandomObjTask(
      poolInterview,
      aiInterviewSnenarios,
    )
    setRandomInterview(selectedItem)
    setPoolInterview(newPool)
    // При смене темы сбрасываем состояние упражнения в сторе
    dispatch(resetExerciseState(EXERCISE_NAME))
  }

  const handleCloseExercise = () => {
    dispatch(resetExerciseState(EXERCISE_NAME))
    routerNavigator.push('/exercises/level3')
  }

  const handleRestartExercise = () => {
    dispatch(resetExerciseState(EXERCISE_NAME))
    setScreenStatus(SCREEN_STATUS.IDLE)
  }

  if (!randomInterview) return <ScreenSpinner />

  return (
    <div className={styles.main_interview}>
      <h2 className={styles.title}>Неудобный вопрос</h2>
      <p className={styles.descr}>
        Формат острого телеинтервью с ИИ в роли ведущего
      </p>

      <div className={styles.screen}>
        {screenStatus === SCREEN_STATUS.IDLE && (
          <InterviewIdle
            onRefreshTopic={() => handleRefreshTopic()}
            onShowTheory={() => setShowModal(true)}
            interviewData={randomInterview}
            onStart={handleStartInerview}
          />
        )}

        {screenStatus === SCREEN_STATUS.RUNNING && (
          <InterviewProcess
            numberRounds={TOTAL_ROUNDS}
            interview={randomInterview}
            messages={messages}
            timeLimit={TIME_ROUND}
            aiStatus={aiStatus}
            onStopRecording={handleStopRecording}
            onStartRecording={handleStartRecording}
            onFinishExercise={handleFinishExercise}
            onAutoFinish={handleAutoSubmit}
            isAiThinking={isLoading}
          />
        )}

        {screenStatus === SCREEN_STATUS.FINISHED && (
          <InterviewResult
            onCloseExercise={handleCloseExercise}
            onRestartExercise={handleRestartExercise}
          />
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

export default InterviewAi
