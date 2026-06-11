import React, { useEffect, useState } from 'react'
import { CiMicrophoneOn } from 'react-icons/ci'
import { TbScoreboard } from 'react-icons/tb'
import { FaStopCircle } from 'react-icons/fa'

import styles from './RandomWordProcess.module.css' // Используем исходные стили
import ChatRandomWord from './chat-random-word/ChatRandomWord' // Подключаем правильный чат импровизации

import { AI_STATUS } from '../../../../../constants/exercises'

const RandomWordProcess = ({
  numberRounds,
  messages,
  timeLimit,
  aiStatus,
  onStopRecording,
  onStartRecording,
  onFinishScenario, // Ваша функция завершения для сценария
  isAiThinking,
}) => {
  const [timer, setTimer] = useState(timeLimit)
  const [currentRound, setCurrentRound] = useState(0)
  const userMessagesCount = messages.filter(
    (msg) => msg.role === 'user',
  ).length

  const progress = (currentRound / numberRounds) * 100

  useEffect(() => {
    if (
      userMessagesCount >= numberRounds &&
      aiStatus === AI_STATUS.IDLE
    ) {
      setCurrentRound(0)
    } else if (
      currentRound < numberRounds &&
      aiStatus === AI_STATUS.FINISHED
    ) {
      setCurrentRound(1)
    }
  }, [currentRound, numberRounds, aiStatus, userMessagesCount])

  // Сброс таймера при новом раунде записи
  useEffect(() => {
    if (aiStatus === AI_STATUS.RECORDING) {
      setTimer(timeLimit)
    }
  }, [aiStatus, timeLimit])

  // Таймер раунда
  useEffect(() => {
    let interval
    // Таймер тикает ТОЛЬКО когда идет запись
    if (aiStatus === AI_STATUS.RECORDING && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    // Авто-стоп по истечении времени
    if (timer === 0 && aiStatus === AI_STATUS.RECORDING) {
      onStopRecording() // Функция, которая меняет статус на PROCESSING
    }
    return () => clearInterval(interval)
  }, [aiStatus, timer, onStopRecording])

  return (
    <div className={styles.screen_running}>
      {/* Прогресс-бар */}
      <div className={styles.debate_header}>
        <div className={styles.progress_container}>
          <div className={styles.progress_text}>
            <div>
              {currentRound >= numberRounds
                ? 'Упражнение окончено'
                : `Раунд ${currentRound} из ${numberRounds}`}
            </div>
            {/* Серый фон бара */}
            <div className={styles.progress_bar_bg}>
              {/* Синяя заливка прогресса */}
              <div
                className={styles.progress_bar_fill}
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Чат для вывода темы, секретного слова и ответов ИИ */}
      <ChatRandomWord
        messages={messages}
        aiStatus={aiStatus}
        isAiThinking={isAiThinking}
      />

      <div className={styles.debate_footer}>
        {aiStatus === AI_STATUS.IDLE && (
          <button
            onClick={onStartRecording}
            className={styles.record_full_btn}
          >
            Нажмите, чтобы <CiMicrophoneOn size={25} />
          </button>
        )}

        {aiStatus === AI_STATUS.RECORDING && (
          <div className={styles.recording_wrapper}>
            <div className={styles.pulse_circle}></div>
            <span className={styles.timer_text}>{timer} сек</span>
            <button
              onClick={onStopRecording}
              className={styles.stop_btn}
            >
              <FaStopCircle size={45} />
            </button>
          </div>
        )}

        {(aiStatus === AI_STATUS.PROCESSING ||
          aiStatus === AI_STATUS.AI_THINKING) && (
          <div className={styles.status_wrapper}>
            <div className={styles.typing_dots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={styles.status_text}>
              {aiStatus === AI_STATUS.PROCESSING
                ? 'Обработка речи...'
                : 'ИИ готовит ответ...'}
            </span>
          </div>
        )}

        {aiStatus === AI_STATUS.FINISHED && (
          <button
            onClick={onFinishScenario}
            className={styles.debate_finish_btn}
          >
            Завершить и проанализировать <TbScoreboard size={25} />
          </button>
        )}
      </div>
    </div>
  )
}

export default RandomWordProcess
