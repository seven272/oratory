import { useEffect, useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { ScreenSpinner } from '@vkontakte/vkui'
import { useDispatch, useSelector } from 'react-redux'

import styles from './AlibiAi.module.css'
import { alibiScenarios } from '../../../../assets/data/scenarios/alibiScenarios'
// import { aiIcebreakerScenarios } from '../../../../assets/mocks/aiData'
import { getRandomObjTask } from '../../../../utils/getRandomObjTask'
import AlibiIdle from './alibi-idle/AlibiIdle'
import AlibiProcess from './alibi-process/AlibiProcess'
import AlibiResult from './alibi-result/AlibiResult'
import { useSpeechSber } from '../../../../hooks/useSpeechSber'
import {
  SCREEN_STATUS,
  AI_STATUS,
} from '../../../../constants/exercises'

import {
  setIcebreakerAiStatus,
  resetIcebreakerState,
  fetchStartIcebreaker,
  fetchResponseIcebreaker,
  fetchFinishIcebreaker,
} from '../../../../redux/slices/ai-exercises/icebreakerSlice'
import TheoryContent from '../../../theory-content/TheoryContent'
import Modal from '../../../../UI/modal/Modal'

const TOTAL_ROUNDS = 7
const TIME_ROUND = 10

const AlibiAi = ({ alias, isDaily }) => {
  const { startListening, stopListening, resetTranscript } =
    useSpeechSber()
  const dispatch = useDispatch()
  const routerNavigator = useRouteNavigator()
  // --- СОСТОЯНИЕ КОМПОНЕНТА (ТОЛЬКО UI-состояние) ---
  const [randomSituation, setRandomSituation] = useState(null)
  const [poolSituation, setPoolSituation] = useState([])
  const [screenStatus, setScreenStatus] = useState(SCREEN_STATUS.IDLE)
  const [showModal, setShowModal] = useState(false)

  // --- СОСТОЯНИЕ ИЗ REDUX (ГЛОБАЛЬНОЕ) ---
  const exerciseState = useSelector((state) => state.icebreaker)
  const { messages, exStatus, aiStatus, warmth } = exerciseState
  const isLoading = exStatus === 'loading'

  // Инициализация темы разговора
  useEffect(() => {
    const { selectedItem, newPool } = getRandomObjTask(
      [],
      alibiScenarios,
    )
    setRandomSituation(selectedItem)
    setPoolSituation(newPool)

    // Очистка при размонтировании компонента
    return () => {
      dispatch(resetIcebreakerState())
    }
  }, [dispatch])

  const handleStartExercise = () => {
    if (!randomSituation) return
    dispatch(fetchStartIcebreaker(randomSituation))
    setScreenStatus(SCREEN_STATUS.RUNNING)
  }

  const handleStartRecording = () => {
    resetTranscript() // Очистить старый текст
    // Переключаем статус, чтобы UI мгновенно отобразил пульсацию и счетчик
    dispatch(setIcebreakerAiStatus(AI_STATUS.RECORDING))
    startListening()
  }

  const handleStopRecording = () => {
    // ЗАЩИТА: Блокируем повторные вызовы от таймеров, если ИИ уже обрабатывает реплику
    if (isLoading || aiStatus === AI_STATUS.AI_THINKING) return

    // Передаем колбэк: он выполнится СТРОГО один раз, когда файл собран в памяти
    stopListening((readyBlob) => {
      if (!readyBlob || readyBlob.size === 0) {
        console.warn('Микрофон выдал пустой буфер в ледоколе')
        return
      }

      // 1. Включаем статус анимации мышления
      dispatch(setIcebreakerAiStatus(AI_STATUS.AI_THINKING))

      // 2. Отправляем единственный бинарный файл на бэкенд
      dispatch(
        fetchResponseIcebreaker({
          audioBlob: readyBlob,
        }),
      ).then(() => {
        // 3. Сбрасываем внутренние буферы хука для следующего хода
        resetTranscript()
      })
    })
  }

  const handleFinishDialog = () => {
    // меняем экран на финальный
    setScreenStatus(SCREEN_STATUS.FINISHED)
    // диспатч на получение оценки,
    dispatch(fetchFinishIcebreaker({ isDaily }))
  }

  const handleAutoSubmit = () => {
    handleStopRecording()
  }

  const handleRefreshTopic = () => {
    const { selectedItem, newPool } = getRandomObjTask(
      poolSituation,
      alibiScenarios,
    )
    setRandomSituation(selectedItem)
    setPoolSituation(newPool)
    // При смене темы сбрасываем состояние упражнения в сторе
    dispatch(resetIcebreakerState())
  }

  const handleCloseExercise = () => {
    dispatch(resetIcebreakerState())
    routerNavigator.push('/exercises/level3')
  }

  const handleRestartExercise = () => {
    dispatch(resetIcebreakerState())
    setScreenStatus(SCREEN_STATUS.IDLE)
  }

  if (!randomSituation) return <ScreenSpinner />

  return (
    <div className={styles.main_icebreaker}>
      <h2 className={styles.title}>Железное алиби</h2>
      <p className={styles.descr}>Убеди прокурора в своей невиновности</p>

      <div className={styles.screen}>
        {screenStatus === SCREEN_STATUS.IDLE && (
          <AlibiIdle
            onRefreshTopic={() => handleRefreshTopic()}
            onShowTheory={() => setShowModal(true)}
            situationData={randomSituation}
            onStart={handleStartExercise}
          />
        )}

        {screenStatus === SCREEN_STATUS.RUNNING && (
          <AlibiProcess
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
          <AlibiResult
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

export default AlibiAi
