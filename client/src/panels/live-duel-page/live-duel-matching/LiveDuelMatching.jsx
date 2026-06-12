import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFallbackToAiBot, fetchJoinLiveRoom } from '../../../redux/slices/liveDuelSlice'
import styles from './LiveDuelMatching.module.css'

const LiveDuelMatching = () => {
  const dispatch = useDispatch()
  const { currentRoom, loading } = useSelector((state) => state.liveDuel)
  
  const [timerSeconds, setTimerSeconds] = useState(30)
  
  // Рефы для хранения актуального таймера и интервалов
  const countdownRef = useRef(null)
  const pollingRef = useRef(null)

  useEffect(() => {
    // 1. Таймер обратного отсчета (30 секунд)
    countdownRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          clearInterval(pollingRef.current)
          // Время вышло -> бесшовно подключаем ИИ
          if (currentRoom?._id) {
            dispatch(fetchFallbackToAiBot({ room_id: currentRoom._id }))
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // 2. Пулл-запросы (Раз в 3 секунды проверяем, не зашел ли человек)
    pollingRef.current = setInterval(() => {
      if (currentRoom?._id) {
        dispatch(fetchJoinLiveRoom({ room_id: currentRoom._id }))
          .unwrap()
          .then((res) => {
            // Если статус комнаты сменился на active, значит игрок Б найден!
            if (res.room?.status === 'active' && !res.room?.is_ai_bot) {
              clearInterval(countdownRef.current)
              clearInterval(pollingRef.current)
            }
          })
          .catch(() => {
            // Ошибки пуллинга игнорируем, продолжаем искать до конца таймера
          })
      }
    }, 3000)

    // Очистка таймеров при размонтировании экрана
    return () => {
      clearInterval(countdownRef.current)
      clearInterval(pollingRef.current)
    }
  }, [currentRoom, dispatch])

  // Рендеринг инвайт-ссылки, если выбран тип direct_link
  const isDirectLink = currentRoom?.creation_type === 'direct_link'
  const inviteUrl = isDirectLink 
    ? `https://vk.com{currentRoom?.invite_token}` 
    : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    alert('Ссылка скопирована в буфер обмена!')
  }

  return (
    <div className={styles.matching_container}>
      <div className={styles.pulse_loader}>
        <div className={styles.circle_core}>🎙️</div>
        <div className={styles.wave_ring}></div>
        <div className={styles.wave_ring_delayed}></div>
      </div>

      <h2 className={styles.matching_title}>
        {isDirectLink ? 'Ожидание друга...' : 'Ищем оппонента...'}
      </h2>
      
      <div className={styles.timer_badge}>
        Осталось времени: <span className={styles.seconds_count}>{timerSeconds}s</span>
      </div>

      <p className={styles.matching_hint}>
        {isDirectLink 
          ? 'Отправьте ссылку другу. Если никто не подключится, вы сможете сразиться с нашим ИИ-ботом.' 
          : 'Бэкенд подбирает оратора равного уровня. Если поиск затянется, сессия автоматически переключится на ИИ.'}
      </p>

      {isDirectLink && (
        <div className={styles.invite_box}>
          <input 
            type="text" 
            className={styles.invite_input} 
            value={inviteUrl} 
            readOnly 
          />
          <button className={styles.copy_button} onClick={handleCopyLink}>
            Копировать
          </button>
        </div>
      )}

      {loading && <div className={styles.sub_loader_text}>Подключаем ИИ-эксперта...</div>}
    </div>
  )
}

export default LiveDuelMatching
