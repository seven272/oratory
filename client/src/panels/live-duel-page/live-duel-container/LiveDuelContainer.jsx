import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  resetLiveDuelState,
  setSearchStatus,
} from '../../../redux/slices/liveDuelSlice'

import LiveDuelSelection from './live-duel-selection/LiveDuelSelection'
import LiveDuelMatching from './live-duel-matching/LiveDuelMatching'
import LiveDuelLinkWaiting from './live-duel-link-waiting/LiveDuelLinkWaiting'
import LiveRoomReal from './live-room-real/LiveRoomReal'
import LiveRoomAi from './live-room-ai/LiveRoomAi'
import LiveDuelCreateSlot from './live-duel-create-slot/LiveDuelCreateSlot'
import LiveDuelSlotsList from './live-duel-slots-list/LiveDuelSlotsList'
import styles from './LiveDuelContainer.module.css'

const LiveDuelContainer = () => {
  const dispatch = useDispatch()
  const { searchStatus, currentRoom } = useSelector(
    (state) => state.liveDuel,
  )

  // СИНХРОНИЗАЦИЯ: Если мы были в поиске, но пуллинг обновил статус комнаты в базе на 'active'
  useEffect(() => {
    if (
      searchStatus === 'searching' &&
      currentRoom?.status === 'active'
    ) {
      console.log(
        '=== СИНХРОНИЗАЦИЯ: Оппонент найден! Переключаем на игру ===',
      )
      dispatch(setSearchStatus('active'))
    }
  }, [currentRoom?.status, searchStatus, dispatch])

  // Очищаем состояние дуэлей при выходе пользователя с этого экрана
  useEffect(() => {
    return () => {
      dispatch(resetLiveDuelState())
    }
  }, [dispatch])

  // Функция для принудительного возврата на стартовый экран
  const handleBackToMenu = () => {
    dispatch(resetLiveDuelState())
  }

  // Проверяем, находится ли пользователь НЕ на главном экране
  // (чтобы кнопка возврата не дублировалась на стартовой странице)
  const showBackButton = searchStatus !== 'idle'

  // Фабрика рендеринга экранов в зависимости от статуса матчмейкинга
  const renderCurrentScreen = () => {
    switch (searchStatus) {
      case 'idle':
      case 'failed':
        return <LiveDuelSelection />
      case 'searching':
        return <LiveDuelMatching />
      case 'link_waiting':
        return <LiveDuelLinkWaiting room={currentRoom} />
      case 'slot_create':
        return (
          <div className={styles.sub_screen_holder}>
            <LiveDuelCreateSlot />
          </div>
        )

      // Новое состояние 1: Полноэкранный поиск чужих слотов в расписании
      case 'slots_list':
        return (
          // Здесь рендерится ваш текущий список слотов, очищенный от лишних кнопок меню
          <div className={styles.sub_screen_holder}>
            {/* Сюда прокидываются пропсы из вашего стейта */}
            <LiveDuelSlotsList />
          </div>
        )

      case 'active':
        // Свойство адаптировано под camelCase (isAiBot вместо is_ai_bot)
        if (currentRoom?.isAiBot) {
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

      {/* Контрастная кнопка возврата на главный экран */}
      {showBackButton && (
        <div
          style={{
            width: '100%',
            marginBottom: '12px',
            padding: '0 4px',
          }}
        >
          <button
            onClick={handleBackToMenu}
            style={{
              background: 'none',
              border: '1px solid var(--color-secondary)',
              color: 'var(--color-text-secondary)',
              font: 'var(--font-s)',
              fontWeight: '500',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                'var(--color-bg)'
              e.currentTarget.style.color =
                'var(--color-text-primary)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color =
                'var(--color-text-secondary)'
            }}
          >
            ← Вернуться в главное меню
          </button>
        </div>
      )}
      {renderCurrentScreen()}
    </div>
  )
}

export default LiveDuelContainer
