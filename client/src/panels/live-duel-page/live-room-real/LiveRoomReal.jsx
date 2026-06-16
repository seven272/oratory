import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetLiveDuelState, fetchSubmitLiveRating } from '../../../redux/slices/liveDuelSlice'
import styles from './LiveRoomReal.module.css'

const LiveRoomReal = () => {
  const dispatch = useDispatch()
  const { currentRoom } = useSelector((state) => state.liveDuel)
  const currentUserId = useSelector((state) => state.profile?.user?._id || state.auth?.user?._id)

  // Инициализация раундов: 'intro' (0:30), 'speaker_a' (2:00), 'speaker_b' (2:00), 'blitz' (1:00), 'feedback'
  const [currentRound, setCurrentRound] = useState('intro')
  const [timeLeft, setTimeLeft] = useState(30) // Стартуем с 30 секунд на знакомство
  const [isVoted, setIsVoted] = useState(false)

  const timerRef = useRef(null)

  // Определяем позицию текущего пользователя
  const isSpeakerA = currentRoom?.user_a === currentUserId
  const mySide = isSpeakerA ? currentRoom?.topic?.side_a : currentRoom?.topic?.side_b
  const opponentSide = isSpeakerA ? currentRoom?.topic?.side_b : currentRoom?.topic?.side_a

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Логика переключения раундов по таймеру
          if (currentRound === 'intro') {
            setCurrentRound('speaker_a')
            return 120 // 2 минуты для Спикера А
          } else if (currentRound === 'speaker_a') {
            setCurrentRound('speaker_b')
            return 120 // 2 минуты для Спикера Б
          } else if (currentRound === 'speaker_b') {
            setCurrentRound('blitz')
            return 60 // 1 минута на блиц-вопросы
          } else {
            clearInterval(timerRef.current)
            setCurrentRound('feedback')
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [currentRound])

  // Форматирование времени в формат ММ:СС
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Возвращает понятный текст текущего статуса дискуссии
  const getRoundTitle = () => {
    switch (currentRound) {
      case 'intro': return '🤝 Знакомство и подготовка'
      case 'speaker_a': return '📢 Монолог Спикера А'
      case 'speaker_b': return '📢 Монолог Спикера Б'
      case 'blitz': return '⚡ Блиц-раунд (Вопросы)'
      case 'feedback': return '🏆 Выставление оценок'
      default: return ''
    }
  }

  // Завершение дуэли и начисление наград
  // 🔥 ИНТЕГРИРОВАННЫЙ МЕТОД: Завершение дуэли и начисление наград через Бэкенд
  const handleVoteSubmit = (rating) => {
    if (!currentRoom?._id) return

    setIsVoted(true)

    // Отправляем данные на бэкенд контроллеру submitRating
    dispatch(fetchSubmitLiveRating({ roomId: currentRoom._id, rating }))
      .unwrap()
      .then((data) => {
        // Формируем красивое уведомление с реальными данными геймификации сервера
        let successMessage = `Вы поставили оппоненту ${rating}/5!\n\n`
        successMessage += `🎉 Награда зачислена:\n`
        successMessage += `+ ${data.earnedXp} XP (с учетом множителя стрика)\n`
        successMessage += `+ ${data.earnedCoins} монет\n`

        if (data.isLevelUp) {
          successMessage += `\n🚀 ПОВЫШЕНИЕ УРОВНЯ! Ваш новый уровень: ${data.stats?.level}!`
        }

        if (data.newAchievements && data.newAchievements.length > 0) {
          successMessage += `\n🏆 ПОЛУЧЕНО ДОСТИЖЕНИЕ: ${data.newAchievements.map(a => a.title || a).join(', ')}!`
        }

        alert(successMessage)
        
        // Сбрасываем комнату и возвращаем пользователя на экран выбора режима
        dispatch(resetLiveDuelState())
      })
      .catch((err) => {
        alert(`Ошибка при сохранении результатов: ${err}`)
        setIsVoted(false) // Разрешаем попробовать проголосовать снова в случае сбоя сети
      })
  }

  return (
    <div className={styles.duel_room_container}>
      {/* Шапка с таймером */}
      <div className={styles.header_card}>
        <span className={styles.round_badge}>{getRoundTitle()}</span>
        {currentRound !== 'feedback' && (
          <h1 className={styles.timer_display}>{formatTime(timeLeft)}</h1>
        )}
      </div>

      {/* Карточка темы */}
      <div className={styles.topic_card}>
        <h3 className={styles.topic_label}>Тема дискуссии:</h3>
        <h2 className={styles.topic_title}>«{currentRoom?.topic?.title}»</h2>
        <div className={styles.my_position_box}>
          Ваша позиция: <strong className={styles.side_highlight}>{mySide}</strong>
        </div>
      </div>

      {/* Экран активных раундов общения */}
      {currentRound !== 'feedback' && (
        <div className={styles.action_block}>
          {/* Индикатор, чья сейчас очередь говорить */}
          <div className={styles.turn_indicator}>
            {currentRound === 'speaker_a' && (
              <p className={isSpeakerA ? styles.your_turn : styles.opponent_turn}>
                {isSpeakerA ? '👉 СЕЙЧАС ВАШ ХОД! Говорите аргументированно.' : '⏳ Слушайте оппонента и фиксируйте контраргументы.'}
              </p>
            )}
            {currentRound === 'speaker_b' && (
              <p className={!isSpeakerA ? styles.your_turn : styles.opponent_turn}>
                {!isSpeakerA ? '👉 СЕЙЧАС ВАШ ХОД! Говорите аргументированно.' : '⏳ Слушайте оппонента и фиксируйте контраргументы.'}
              </p>
            )}
            {currentRound === 'blitz' && (
              <p className={styles.blitz_turn}>🔥 Свободная дискуссия! Задавайте вопросы и отвечайте взаимно.</p>
            )}
          </div>

          {/* Главная кнопка перехода в ВК звонок */}
          <a 
            href={currentRoom?.vk_call_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.vk_call_btn}
          >
            📞 Открыть VK Звонок
          </a>
          <p className={styles.vk_hint}>Звонок откроется в официальном приложении VK. Вернитесь сюда, чтобы следить за таймером раундов.</p>
        </div>
      )}

      {/* Экран взаимного оценивания (Финиш) */}
      {currentRound === 'feedback' && (
        <div className={styles.feedback_block}>
          <h3 className={styles.feedback_title}>Как справился ваш оппонент?</h3>
          <p className={styles.feedback_description}>Оцените культуру речи, силу аргументов и убедительность собеседника:</p>
          
          {!isVoted ? (
            <div className={styles.rating_buttons}>
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  key={num} 
                  className={styles.rating_btn} 
                  onClick={() => handleVoteSubmit(num)}
                >
                  {num} ⭐
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.success_vote}>Спасибо за оценку! Возвращаемся в меню...</div>
          )}
        </div>
      )}
    </div>
  )
}

export default LiveRoomReal
