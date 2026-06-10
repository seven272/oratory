import React, { useEffect, useState } from 'react'
import { CiMicrophoneOn } from 'react-icons/ci'
import { TbScoreboard } from 'react-icons/tb'
import { FaStopCircle } from 'react-icons/fa'

import styles from './PoemActingProcess.module.css'
import ChatPoemActing from './chat-poem-acting/ChatPoemActing'
import { AI_STATUS } from '../../../../../constants/exercises'

const PoemActingProcess = ({
  numberRounds,
  acting,
  messages,
  timeLimit,
  aiStatus,
  onStopRecording,
  onStartRecording,
  onFinishActing,
  isAiThinking,
}) => {
  const [timer, setTimer] = useState(timeLimit)
  const [currentRound, setCurrentRound] = useState(0)

  const userMessagesCount = messages.filter((msg) => msg.role === 'user').length
  const progress = (currentRound / numberRounds) * 100

  useEffect(() => {
    if (userMessagesCount >= numberRounds && aiStatus === AI_STATUS.IDLE) {
      setCurrentRound(0)
    } else if (currentRound < numberRounds && aiStatus === AI_STATUS.FINISHED) {
      setCurrentRound(1)
    }
  }, [currentRound, numberRounds, aiStatus, userMessagesCount])

  useEffect(() => {
    if (aiStatus === AI_STATUS.RECORDING) {
      setTimer(timeLimit)
    }
  }, [aiStatus, timeLimit])

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
      {/* Верхняя панель прогресса */}
      <div className={styles.session_header}>
        <div className={styles.progress_container}>
          <div className={styles.progress_text}>
            <div>
              {currentRound >= numberRounds
                ? 'Запись завершена'
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

      {/* Карточка суфлера с текстом стиха и текущей ролью */}
      <div className={styles.prompt_card}>
        <span className={styles.prompt_label}>Роль: {acting.actingRole}</span>
        <p className={styles.prompt_text}>«{acting.poemText}»</p>
        <div className={styles.mini_badges}>
          <span className={styles.mini_badge}>🎭 Отыгрыш</span>
        </div>
      </div>

      {/* Изолированный чат транскрипта */}
      <ChatPoemActing
        messages={messages}
        aiStatus={aiStatus}
        isAiThinking={isAiThinking}
      />

      {/* Панель кнопок управления */}
      <div className={styles.session_footer}>
        {aiStatus === AI_STATUS.IDLE && (
          <button onClick={onStartRecording} className={styles.record_full_btn}>
            Включить запись и играть <CiMicrophoneOn size={25} />
          </button>
        )}

        {aiStatus === AI_STATUS.RECORDING && (
          <div className={styles.recording_wrapper}>
            <div className={styles.pulse_circle}></div>
            <span className={styles.timer_text}>{timer} сек</span>
            <button onClick={onStopRecording} className={styles.stop_btn}>
              <FaStopCircle size={45} />
            </button>
          </div>
        )}

        {(aiStatus === AI_STATUS.PROCESSING || aiStatus === AI_STATUS.AI_THINKING) && (
          <div className={styles.status_wrapper}>
            <div className={styles.typing_dots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={styles.status_text}>
              {aiStatus === AI_STATUS.PROCESSING
                ? 'Анализ актерской игры...'
                : 'Режиссер-ИИ отсматривает дубль...'}
            </span>
          </div>
        )}

        {aiStatus === AI_STATUS.FINISHED && (
          <button onClick={onFinishActing} className={styles.session_finish_btn}>
            Посмотреть разбор режиссера <TbScoreboard size={25} />
          </button>
        )}
      </div>
    </div>
  )
}

export default PoemActingProcess
