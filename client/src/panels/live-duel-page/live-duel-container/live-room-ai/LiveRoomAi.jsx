import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetLiveDuelState } from '../../../../redux/slices/liveDuelSlice'
import styles from './LiveRoomAi.module.css'

const LiveRoomAi = () => {
  const dispatch = useDispatch()
  const { currentRoom, aiGreeting, loading } = useSelector((state) => state.liveDuel)

  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [currentTurn, setCurrentTurn] = useState(1)
  const [isFinished, setIsFinished] = useState(false)
  const [aiEvaluation, setAiEvaluation] = useState(null)

  const chatBottomRef = useRef(null)

  // Инициализируем чат приветствием от ИИ
  useEffect(() => {
    if (aiGreeting) {
      setChatLog([
        {
          id: 'initial_ai',
          sender: 'ai',
          text: aiGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }
  }, [aiGreeting])

  // Автоскролл чата вниз при новых сообщениях
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || loading || isFinished) return

    const userMessageText = message.trim()
    setMessage('')

    // Добавляем сообщение пользователя в лог
    const updatedLog = [
      ...chatLog,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: userMessageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
    setChatLog(updatedLog)

    // Если это последний (3-й) ход пользователя, то запрашиваем финал и оценку
    if (currentTurn >= 3) {
      setIsFinished(true)
      // Имитируем успешный ответ ИИ-судьи с разбором (ключи приведены к camelCase)
      setTimeout(() => {
        setAiEvaluation({
          logic: 85,
          convincingness: 78,
          counterArgumentation: 90, // Перевели в camelCase
          feedback: 'Отличная структурированная речь! Вы успешно парировали тезисы об автоматизации образования, однако стоит добавить больше статистических данных в аргументацию.'
        })
      }, 1500)
    } else {
      // Фиксируем следующий ход локально для избежания багов с асинхронным стейтом
      const nextTurn = currentTurn + 1
      setCurrentTurn(nextTurn)
      
      // Имитируем ответ GigaChat
      setTimeout(() => {
        setChatLog((prevLog) => [
          ...prevLog,
          {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: `Это интересный аргумент на ходу №${nextTurn}. Однако учтите, что технологии развиваются экспоненциально, и человеческий фактор может стать узким горлышком системы. Что думаете на этот счет?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 1200)
    }
  }

  const handleCloseSession = () => {
    alert('Тренировка с ИИ завершена! Вам начислено 100 XP для сохранения стрика активности.')
    dispatch(resetLiveDuelState())
  }

  return (
    <div className={styles.ai_room_container}>
      {/* Панель информации о сессии */}
      <div className={styles.info_header}>
        <div className={styles.topic_info}>
          <span className={styles.info_badge}>🤖 ИИ-Оппонент</span>
          <h2 className={styles.topic_title_short}>«{currentRoom?.topic?.title}»</h2>
        </div>
        {!isFinished && (
          <div className={styles.turn_badge}>
            Ход: <span className={styles.turn_count}>{currentTurn}/3</span>
          </div>
        )}
      </div>

      {/* Окно чата / Результаты */}
      {!aiEvaluation ? (
        <div className={styles.chat_window}>
          {chatLog.map((msg) => (
            <div 
              key={msg.id} 
              className={msg.sender === 'user' ? styles.message_user : styles.message_ai}
            >
              <div className={styles.message_bubble}>{msg.text}</div>
              <span className={styles.message_time}>{msg.timestamp}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
      ) : (
        /* Экран финальной оценки ИИ-судьи */
        <div className={styles.evaluation_card}>
          <h3 className={styles.eval_title}>🏆 Вердикт ИИ-Судьи</h3>
          <p className={styles.eval_feedback}>{aiEvaluation.feedback}</p>
          
          <div className={styles.metrics_grid}>
            <div className={styles.metric_item}>
              <span className={styles.metric_name}>Логика</span>
              <strong className={styles.metric_val}>{aiEvaluation.logic}/100</strong>
            </div>
            <div className={styles.metric_item}>
              <span className={styles.metric_name}>Убедительность</span>
              <strong className={styles.metric_val}>{aiEvaluation.convincingness}/100</strong>
            </div>
            <div className={styles.metric_item}>
              <span className={styles.metric_name}>Контраргументы</span>
              <strong className={styles.metric_val}>{aiEvaluation.counterArgumentation}/100</strong>
            </div>
          </div>

          <button className={styles.finish_btn} onClick={handleCloseSession}>
            Забрать 100 XP и выйти
          </button>
        </div>
      )}

      {/* Форма отправки сообщения (скрывается на экране оценок) */}
      {!isFinished && !aiEvaluation && (
        <form className={styles.input_form} onSubmit={handleSendMessage}>
          <input
            type="text"
            className={styles.chat_input}
            placeholder={loading ? 'ИИ думает...' : 'Введите ваш аргумент...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            required
          />
          <button 
            type="submit" 
            className={styles.send_btn}
            disabled={loading || !message.trim()}
          >
            {loading ? '⏳' : '🚀'}
          </button>
        </form>
      )}
    </div>
  )
}

export default LiveRoomAi
