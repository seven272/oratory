import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ScreenSpinner } from '@vkontakte/vkui'
import { useDispatch, useSelector } from 'react-redux'

import styles from './IcebreakerAi.module.css'
import { aiIcebreakerScenarios } from '../../../../assets/mocks/aiData'
import { getRandomObjTask } from '../../../../utils/getRandomObjTask'
import IcebreakerIdle from './icebreaker-idle/IcebreakerIdle'
import IcebreakerProcess from './icebreaker-process/IcebreakerProcess'
import IcebreakerResult from './icebreaker-result/IcebreakerResult'
import { useSpeech } from '../../../../hooks/useSpeech'
import {
  SCREEN_STATUS,
  AI_STATUS,
} from '../../../../constants/exercises'
import {
  setActiveExercise,
  resetExerciseState,
  setAiStatus,
  fetchStartIcebreaker,
  fetchResponseIcebreaker,
  fetchFinishIcebreaker,
} from '../../../../redux/slices/aiExerciseSlice'
import TheoryContent from '../../../theory-content/TheoryContent'
import Modal from '../../../../UI/modal/Modal'

const EXERCISE_NAME = 'icebreaker'
const TOTAL_ROUNDS = 7
const TIME_ROUND = 10

// const isSpeechSupported = !!(
//   typeof window !== 'undefined' &&
//   (window.SpeechRecognition || window.webkitSpeechRecognition)
// )

const IcebreakerAi = ({ alias, isDaily }) => {
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
  const [randomSituation, setRandomSituation] = useState(null)
  const [poolSituation, setPoolSituation] = useState([])
  const [screenStatus, setScreenStatus] = useState(SCREEN_STATUS.IDLE)
  const [showModal, setShowModal] = useState(false)

  // --- СОСТОЯНИЕ ИЗ REDUX (ГЛОБАЛЬНОЕ) ---
  const exerciseState = useSelector(
    (state) => state.aiExercise.exercises.icebreaker,
  )
  const { messages, exStatus, aiStatus, warmth } = exerciseState
  const isLoading = exStatus === 'loading'

  // Инициализация темы разговора
  useEffect(() => {
    const { selectedItem, newPool } = getRandomObjTask(
      [],
      aiIcebreakerScenarios,
    )
    setRandomSituation(selectedItem)
    setPoolSituation(newPool)
    dispatch(setActiveExercise(EXERCISE_NAME))
    // Очистка при размонтировании компонента
    return () => {
      dispatch(resetExerciseState(EXERCISE_NAME))
    }
  }, [dispatch])

  const handleStartExercise = () => {
    if (!randomSituation) return
    dispatch(fetchStartIcebreaker(randomSituation))
    setScreenStatus(SCREEN_STATUS.RUNNING)
  }

  const handleSendUserResponse = (userText) => {
    if (!userText.trim() || isLoading) return

    dispatch(
      fetchResponseIcebreaker({
        situationData: randomSituation,
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
        fetchResponseIcebreaker({
          situationData: randomSituation,
          userMessage: userText,
        }),
      ).then(() => {
        // 5. Очищаем текст в хуке после успешного или неуспешного диспатча
        resetTranscript()
      })
    }, 100)
  }

  const handleFinishDialog = () => {
    // меняем экран на финальный
    setScreenStatus(SCREEN_STATUS.FINISHED)
    // диспатч на получение оценки,
    dispatch(fetchFinishIcebreaker({ isDaily }))
  }

  const handleAutoSubmit = () => {
    const userText =
      transcript ||
      'Вы нечего не сказали. Пропуск хода (время истекло)'
    handleSendUserResponse(userText)
  }

  const handleRefreshTopic = () => {
    const { selectedItem, newPool } = getRandomObjTask(
      poolSituation,
      aiIcebreakerScenarios,
    )
    setRandomSituation(selectedItem)
    setPoolSituation(newPool)
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

  if (!randomSituation) return <ScreenSpinner />

  return (
    <div className={styles.main_icebreaker}>
      <h2 className={styles.title}>Ледокол</h2>
      <p className={styles.descr}>Разговори молчаливого незнакомца</p>

      <div className={styles.screen}>
        {screenStatus === SCREEN_STATUS.IDLE && (
          <IcebreakerIdle
            onRefreshTopic={() => handleRefreshTopic()}
            onShowTheory={() => setShowModal(true)}
            situationData={randomSituation}
            onStart={handleStartExercise}
          />
        )}

        {screenStatus === SCREEN_STATUS.RUNNING && (
          <IcebreakerProcess
            numberRounds={TOTAL_ROUNDS}
            situation={randomSituation}
            messages={messages}
            warmthProgress={warmth}
            timeLimit={TIME_ROUND}
            aiStatus={aiStatus}
            onStopRecording={handleStopRecording}
            onStartRecording={handleStartRecording}
            onFinishDialog={handleFinishDialog}
            onAutoFinish={handleAutoSubmit}
            isAiThinking={isLoading}
          />
        )}

        {screenStatus === SCREEN_STATUS.FINISHED && (
          <IcebreakerResult
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

export default IcebreakerAi
