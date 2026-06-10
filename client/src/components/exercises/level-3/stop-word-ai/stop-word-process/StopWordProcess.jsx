import React, { useEffect, useState } from 'react'
import { CiMicrophoneOn } from 'react-icons/ci'
import { TbScoreboard } from 'react-icons/tb'
import { FaStopCircle } from 'react-icons/fa'

import styles from './StopWordProcess.module.css'
import ChatStopWord from './chat-stop-word/ChatStopWord' // Изолированный компонент чата под данный тренажер
import { AI_STATUS } from '../../../../../constants/exercises'

const StopWordProcess = ({
  numberRounds,
  scenario,
  messages,
  timeLimit,
  aiStatus,
  onStopRecording,
  onStartRecording,
  onFinishExercise,
  isAiThinking,
}) => {
  const [timer, setTimer] = useState(timeLimit)
  const [currentRound, setCurrentRound] = useState(0)

  // Считаем шаги пользователя по истории сообщений
  const userMessagesCount = messages.filter((msg) => msg.role === 'user').length
  const progress = (currentRound / numberRounds) * 100

  useEffect(() => {
    if (userMessagesCount >= numberRounds && aiStatus === AI_STATUS.IDLE) {
      setCurrentRound(0)
    } else if (currentRound < numberRounds && aiStatus === AI_STATUS.FINISHED) {
      setCurrentRound(1)
    }
  }, [currentRound, numberRounds, aiStatus, userMessagesCount])

  // Сброс и запуск таймера
  useEffect(() => {
    if (aiStatus === AI_STATUS.RECORDING) {
      setTimer(timeLimit)
    }
  }, [aiStatus, timeLimit])

  // Логика работы таймера (30 секунд)
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
      {/* Верхняя панель с прогресс-баром */}
      <div className={styles.session_header}>
        <div className={styles.progress_container}>
          <div className={styles.progress_text}>
            <div>
              {currentRound >= numberRounds
                ? 'Монолог завершен'
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

      {/* Карточка-напоминание с круговой обводкой и списками ТАБУ */}
      <div className={styles.prompt_card}>
        <span className={styles.prompt_label}>Задание:</span>
        <p className={styles.prompt_text}>{scenario.task}</p>
        
        <div className={styles.mini_taboo_box}>
          <div className={styles.mini_taboo_row}>
            <span className={styles.mini_label}>Без паразитов:</span>
            <div className={styles.mini_badges}>
              {scenario.tabooParasites.map((word, i) => (
                <span key={i} className={styles.mini_badge_gray}>{word}</span>
              ))}
            </div>
          </div>
          
          <div className={styles.mini_taboo_row}>
            <span className={styles.mini_label}>Без стоп-слов:</span>
            <div className={styles.mini_badges}>
              {scenario.tabooThemeWords.map((word, i) => (
                <span key={i} className={styles.mini_badge_red}>{word}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Интерактивная лента транскрипта */}
      <ChatStopWord
        messages={messages}
        aiStatus={aiStatus}
        isAiThinking={isAiThinking}
      />

      {/* Нижняя панель управления записью */}
      <div className={styles.session_footer}>
        {aiStatus === AI_STATUS.IDLE && (
          <button onClick={onStartRecording} className={styles.record_full_btn}>
            Начать рассказ <CiMicrophoneOn size={25} />
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
                ? 'Проверка ограничений...'
                : 'ИИ-цензор формирует отчет...'}
            </span>
          </div>
        )}

        {aiStatus === AI_STATUS.FINISHED && (
          <button onClick={onFinishExercise} className={styles.session_finish_btn}>
            Посмотреть анализ речи <TbScoreboard size={25} />
          </button>
        )}
      </div>
    </div>
  )
}

export default StopWordProcess
