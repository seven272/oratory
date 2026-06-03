import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ScreenSpinner } from '@vkontakte/vkui'
import { useDispatch, useSelector } from 'react-redux'

import styles from './TribuneAi.module.css'
import { aiTribuneScenarios } from '../../../../assets/mocks/aiData'
import { getRandomObjTask } from '../../../../utils/getRandomObjTask'
import TribuneIdle from './tribune-idle/TribuneIdle'
import TribuneProcess from './tribune-process/TribuneProcess'
import TribuneResult from './tribune-result/TribuneResult'
import { useSpeech } from '../../../../hooks/useSpeech'
import {
  SCREEN_STATUS,
  AI_STATUS,
} from '../../../../constants/exercises'
import {
  setActiveExercise,
  resetExerciseState,
  setAiStatus,
  fetchStartTribune,
  fetchResponseTribune,
  fetchFinishTribune,
} from '../../../../redux/slices/aiExerciseSlice'
import TheoryContent from '../../../theory-content/TheoryContent'
import Modal from '../../../../UI/modal/Modal'

const EXERCISE_NAME = 'tribune'
const TOTAL_ROUNDS = 1
const TIME_ROUND = 60

// const isSpeechSupported = !!(
//   typeof window !== 'undefined' &&
//   (window.SpeechRecognition || window.webkitSpeechRecognition)
// )

const TribuneAi = ({ alias, isDaily }) => {
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
  const [randomTribune, setRandomTribune] = useState(null)
  const [poolTribune, setPoolTribune] = useState([])
  const [screenStatus, setScreenStatus] = useState(SCREEN_STATUS.IDLE)
  const [showModal, setShowModal] = useState(false)

  // --- СОСТОЯНИЕ ИЗ REDUX (ГЛОБАЛЬНОЕ) ---
  const exerciseState = useSelector(
    (state) => state.aiExercise.exercises.tribune,
  )
  const { messages, exStatus, aiStatus } = exerciseState
  const isLoading = exStatus === 'loading'

  // Инициализация темы упражнения
  useEffect(() => {
    const { selectedItem, newPool } = getRandomObjTask(
      [],
      aiTribuneScenarios,
    )
    setRandomTribune(selectedItem)
    setPoolTribune(newPool)
    dispatch(setActiveExercise(EXERCISE_NAME))
    // Очистка при размонтировании компонента
    return () => {
      dispatch(resetExerciseState(EXERCISE_NAME))
    }
  }, [dispatch])

  const handleStartInerview = () => {
    if (!randomTribune) return
    dispatch(fetchStartTribune(randomTribune))
    setScreenStatus(SCREEN_STATUS.RUNNING)
  }

  const handleSendUserResponse = (userText) => {
    if (!userText.trim() || isLoading) return

    dispatch(
      fetchResponseTribune({
        tribuneData: randomTribune,
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
        fetchResponseTribune({
          tribuneData: randomTribune,
          userMessage: userText,
        }),
      ).then(() => {
        // 5. Очищаем текст в хуке после успешного или неуспешного диспатча
        resetTranscript()
      })
    }, 100)
  }

  const handleFinishTribune = () => {
    // 1. Ставим статус "ИИ думает" для красивой анимации внутри TribuneProcess
    dispatch(setAiStatus(AI_STATUS.AI_THINKING))

    // 2. Запускаем получение оценки от GigaChat
    dispatch(fetchFinishTribune({ isDaily }))
      .unwrap() // Позволяет дождаться успешного выполнения промиса
      .then(() => {
        // 3. Только КОГДА данные уже в Redux и exStatus стал 'succeeded' — открываем финальный экран!
        setScreenStatus(SCREEN_STATUS.FINISHED)
      })
      .catch((err) => {
        console.error('Ошибка при получении аналитики трибуны:', err)
        // В случае форс-мажора все равно пускаем на экран, там сработает наш фоллбек
        setScreenStatus(SCREEN_STATUS.FINISHED)
      })
  }

  const handleAutoSubmit = () => {
    const userText =
      transcript || 'Вы нечего не сказали. Время истекло'
    handleSendUserResponse(userText)
  }

  const handleRefreshTopic = () => {
    const { selectedItem, newPool } = getRandomObjTask(
      poolTribune,
      aiTribuneScenarios,
    )
    setRandomTribune(selectedItem)
    setPoolTribune(newPool)
    // При смене темы сбрасываем состояние упражнения в сторе
    dispatch(resetExerciseState(EXERCISE_NAME))
  }

  const handleCloseExercise = () => {
    dispatch(resetExerciseState(EXERCISE_NAME))
    routerNavigator.push('/exercises/level3')
  }

  const handleRestartExercise = () => {
    dispatch(resetExerciseState(EXERCISE_NAME))
    // dispatch(fetchStartTribune(randomTribune))
    setScreenStatus(SCREEN_STATUS.IDLE)
  }

  if (!randomTribune) return <ScreenSpinner />

  return (
    <div className={styles.main_tribune}>
      <h2 className={styles.title}>Трибуна</h2>
      <p className={styles.descr}>
        Выскажись по теме как настоящий оратор
      </p>

      <div className={styles.screen}>
        {screenStatus === SCREEN_STATUS.IDLE && (
          <TribuneIdle
            onRefreshTopic={() => handleRefreshTopic()}
            onShowTheory={() => setShowModal(true)}
            tribuneData={randomTribune}
            onStart={handleStartInerview}
          />
        )}

        {screenStatus === SCREEN_STATUS.RUNNING && (
          <TribuneProcess
            numberRounds={TOTAL_ROUNDS}
            tribune={randomTribune}
            messages={messages}
            timeLimit={TIME_ROUND}
            aiStatus={aiStatus}
            onStopRecording={handleStopRecording}
            onStartRecording={handleStartRecording}
            onFinishTribune={handleFinishTribune}
            onAutoFinish={handleAutoSubmit}
            isAiThinking={isLoading}
          />
        )}

        {screenStatus === SCREEN_STATUS.FINISHED && (
          <TribuneResult
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

export default TribuneAi
