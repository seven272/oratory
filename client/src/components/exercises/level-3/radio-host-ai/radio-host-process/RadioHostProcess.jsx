import React, { useEffect, useState } from 'react'
import { CiMicrophoneOn } from 'react-icons/ci'
import { TbScoreboard } from 'react-icons/tb'
import { FaStopCircle } from 'react-icons/fa'

import styles from './RadioHostProcess.module.css'
import ChatRadioHost from './chat-radio-host/ChatRadioHost' // Изолированный чат с уникальным неймингом
import { AI_STATUS } from '../../../../../constants/exercises'

const RadioHostProcess = ({
  numberRounds,
  radio,
  messages,
  timeLimit,
  aiStatus,
  onStopRecording,
  onStartRecording,
  onFinishRadio,
  isAiThinking,
}) => {
  const [timer, setTimer] = useState(timeLimit)
  const [currentRound, setCurrentRound] = useState(0)

  // Вычисляем количество реплик пользователя в истории чата
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

  // Перезапуск таймера при старте записи прямого эфира
  useEffect(() => {
    if (aiStatus === AI_STATUS.RECORDING) {
      setTimer(timeLimit)
    }
  }, [aiStatus, timeLimit])

  // Работа таймера раунда (авто-стоп через 40 секунд)
  useEffect(() => {
    let interval
    if (aiStatus === AI_STATUS.RECORDING && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    if (timer === 0 && aiStatus === AI_STATUS.RECORDING) {
      onStopRecording()
    }
    return () => clearInterval(interval)
  }, [aiStatus, timer, onStopRecording])

  return (
    <div className={styles.screen_running}>
      {/* Шапка сессии с прогресс-баром и универсальным неймингом */}
      <div className={styles.session_header}>
        <div className={styles.progress_container}>
          <div className={styles.progress_text}>
            <div>
              {currentRound >= numberRounds
                ? 'Прямой эфир завершен'
                : `Раунд ${currentRound} из ${numberRounds}`}
            </div>
            <div className={styles.progress_bar_bg}>
              <div
                className={styles.progress_bar_fill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Карточка ТЗ, которая всегда перед глазами радиоведущего во время импровизации */}
      <div className={styles.prompt_card}>
        <span className={styles.prompt_label}>
          В эфире! Свяжи в один монолог:
        </span>
        <div className={styles.radio_live_tasks}>
          <p className={styles.radio_live_text}>
            ☀️ <b>Погода:</b> {radio.weather}
          </p>
          <p className={styles.radio_live_text}>
            💡 <b>Факт:</b> {radio.funnyFact}
          </p>
          <p className={styles.radio_live_text}>
            🎵 <b>Трек в конце:</b> «{radio.songTransition}»
          </p>
        </div>
      </div>

      {/* Уникальная лента транскрипции SaluteSpeech для Радиоведущего */}
      <ChatRadioHost
        messages={messages}
        aiStatus={aiStatus}
        isAiThinking={isAiThinking}
      />

      {/* Подвал сессии с кнопками управления записью */}
      <div className={styles.session_footer}>
        {aiStatus === AI_STATUS.IDLE && (
          <button
            onClick={onStartRecording}
            className={styles.record_full_btn}
          >
            Открыть микрофон и говорить <CiMicrophoneOn size={25} />
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
                ? 'Сканирование эфирной паузы...'
                : 'Программный директор пишет рецензию...'}
            </span>
          </div>
        )}

        {aiStatus === AI_STATUS.FINISHED && (
          <button
            onClick={onFinishRadio}
            className={styles.session_finish_btn}
          >
            Посмотреть оценку эфира <TbScoreboard size={25} />
          </button>
        )}
      </div>
    </div>
  )
}

export default RadioHostProcess
