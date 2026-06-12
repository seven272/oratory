import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetLiveDuelState } from '../../../redux/slices/liveDuelSlice'

import LiveDuelSelection from '../live-duel-selection/LiveDuelSelection'
import LiveDuelMatching from '../live-duel-matching/LiveDuelMatching'

// Заглушки для экранов комнат, которые мы сверстаем в следующих шагах
const LiveRoomReal = () => (
  <div
    style={{
      padding: '20px',
      color: 'var(--color-black)',
      textAlign: 'center',
    }}
  >
    Экран созвона VK (Реальный игрок)
  </div>
)
const LiveRoomAi = () => (
  <div
    style={{
      padding: '20px',
      color: 'var(--color-black)',
      textAlign: 'center',
    }}
  >
    Экран чат-батла с ИИ-ботом
  </div>
)

import styles from './LiveDuelContainer.module.css'

const LiveDuelContainer = () => {
  const dispatch = useDispatch()
  const { search_status, current_room } = useSelector(
    (state) => state.liveDuel,
  )

  // Очищаем состояние дуэлей при выходе пользователя с этого экрана
  useEffect(() => {
    return () => {
      dispatch(resetLiveDuelState())
    }
  }, [dispatch])

  // Фабрика рендеринга экранов в зависимости от статуса матчмейкинга
  const renderCurrentScreen = () => {
    switch (search_status) {
      case 'idle':
      case 'failed':
        return <LiveDuelSelection />

      case 'searching':
        return <LiveDuelMatching />

      case 'active':
        // Если пара найдена, смотрим, кто стал оппонентом: робот или человек
        if (current_room?.is_ai_bot) {
          return <LiveRoomAi />
        }
        return <LiveRoomReal />

      default:
        return <LiveDuelSelection />
    }
  }

  return (
    <div className={styles.container_wrapper}>
      {renderCurrentScreen()}
    </div>
  )
}

export default LiveDuelContainer
