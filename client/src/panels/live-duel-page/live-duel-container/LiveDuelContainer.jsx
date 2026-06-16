import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetLiveDuelState,
  setSearchStatus,
} from '../../../redux/slices/liveDuelSlice'

import LiveDuelSelection from '../live-duel-selection/LiveDuelSelection'
import LiveDuelMatching from '../live-duel-matching/LiveDuelMatching'
import LiveRoomReal from '../live-room-real/LiveRoomReal'
import LiveRoomAi from '../live-room-ai/LiveRoomAi'

import styles from './LiveDuelContainer.module.css'

const LiveDuelContainer = () => {
  const dispatch = useDispatch()
  const { searchStatus, currentRoom } = useSelector(
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
    switch (searchStatus) {
      case 'idle':
      case 'failed':
        return <LiveDuelSelection />
      case 'searching':
        return <LiveDuelMatching />
      case 'active':
        // Если пара найдена, смотрим, кто стал оппонентом: робот или человек
        if (currentRoom?.is_ai_bot) {
          return <LiveRoomAi />
        }
        return <LiveRoomReal />
      case 'active_real': // Демо-статус для проверки комнаты с человеком
        return <LiveRoomReal />
      case 'active_ai': // Демо-статус для проверки чата с ИИ
        return <LiveRoomAi />

      default:
        return <LiveDuelSelection />
    }
  }

  return (
    <div className={styles.container_wrapper}>
      {/* 🛠️ ВРЕМЕННАЯ ДЕМО-ПАНЕЛЬ ДЛЯ ТЕСТИРОВАНИЯ ВЕРСТКИ */}
      <div
        style={{
          background: '#fff4cc',
          padding: '10px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          borderBottom: '1px solid #ecd98c',
          zIndex: 9999,
        }}
      >
        <button onClick={() => dispatch(setSearchStatus('idle'))}>
          1. Выбор режима
        </button>
        <button
          onClick={() => dispatch(setSearchStatus('searching'))}
        >
          2. Поиск / Ссылка
        </button>
        <button
          onClick={() => dispatch(setSearchStatus('active_real'))}
        >
          3. Комната (Человек)
        </button>
        <button
          onClick={() => dispatch(setSearchStatus('active_ai'))}
        >
          4. Чат (ИИ-бот)
        </button>
      </div>
      {renderCurrentScreen()}
    </div>
  )
}

export default LiveDuelContainer
