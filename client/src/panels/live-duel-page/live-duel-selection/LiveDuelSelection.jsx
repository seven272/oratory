import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'

import {
  fetchCreateLiveRoom,
  fetchJoinLiveRoom,
  fetchGetCalendarRooms,
  fetchGetMyActiveSlots, // <-- Добавлено
  fetchUpdateLiveRoomDate, // <-- Добавлено
  fetchDeleteLiveRoom, // <-- Добавлено
} from '../../../redux/slices/liveDuelSlice'
import styles from './LiveDuelSelection.module.css'
import DuelMenuActions from './duel-menu-actions/DuelMenuActions'
import CalendarCreateSlot from './calendar-create-slot/CalendarCreateSlot'
import CalendarSlotsList from './calendar-slots-list/CalendarSlotsList'

const LiveDuelSelection = () => {
  const dispatch = useDispatch()
  const {
    loading,
    error,
    calendarRooms = [],
    myActiveSlots = [],
  } = useSelector((state) => state.liveDuel)

  const { user } = useSelector((state) => state.auth)
  const [showFormCreateSlot, setShowFormCreateSlot] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  // При открытии общего списка — подгружаем доступные комнаты из базы
  useEffect(() => {
    if (showCalendar) {
      dispatch(fetchGetCalendarRooms())
    }
  }, [showCalendar, dispatch])

  // При открытии формы создания слота — подгружаем личные активные слоты
  useEffect(() => {
    if (showFormCreateSlot) {
      dispatch(fetchGetMyActiveSlots())
    }
  }, [showFormCreateSlot, dispatch])

  const handleQuickSearch = () => {
    dispatch(fetchCreateLiveRoom({ creationType: 'quick_search' }))
      .unwrap()
      .then(() => dispatch(fetchJoinLiveRoom({})))
  }

  const handleDirectLink = () => {
    dispatch(fetchCreateLiveRoom({ creationType: 'direct_link' }))
  }

  const handleCalendarSubmit = async (selectedDate) => {
    try {
      await dispatch(
        fetchCreateLiveRoom({
          creationType: 'calendar',
          scheduledAt: selectedDate,
        }),
      ).unwrap()
      message.success(
        'Ваш слот на дуэль успешно создан, он появится в общем списке!',
      )
      // Обновляем локально списки
      dispatch(fetchGetMyActiveSlots())
      dispatch(fetchGetCalendarRooms())
    } catch (err) {
      message.error(err || 'Произошла ошибка при создании слота.')
    }
  }

  const handleUpdateSlot = async (roomId, newDate) => {
    try {
      await dispatch(
        fetchUpdateLiveRoomDate({ roomId, scheduledAt: newDate }),
      ).unwrap()
      message.success('Дата слота успешно изменена!')
      dispatch(fetchGetCalendarRooms()) // Синхронизируем глобальную ленту
    } catch (err) {
      message.error(err || 'Не удалось обновить слот')
    }
  }

  const handleCancelSlot = async (roomId) => {
    try {
      await dispatch(fetchDeleteLiveRoom({ roomId })).unwrap()
      message.success('Слот успешно удален!')
      dispatch(fetchGetCalendarRooms()) // Синхронизируем глобальную ленту
    } catch (err) {
      message.error(err || 'Не удалось удалить слот')
    }
  }

  const handleBookSlot = (roomId) => {
    dispatch(fetchJoinLiveRoom({ roomId }))
      .unwrap()
      .then(() => {
        message.success(
          'Вы успешно записались на дуэль! Ожидайте начала в назначенное время.',
        )
      })
      .catch((err) => message.error(`Не удалось записаться: ${err}`))
  }

  return (
    <div className={styles.selection_container}>
      <h1 className={styles.main_title}>🎙️ Живые Дуэли</h1>
      <p className={styles.main_description}>
        Практикуйте ораторское мастерство с реальными людьми или
        ИИ-тренером в режиме реального времени.
      </p>

      {error && <div className={styles.error_banner}>{error}</div>}

      <DuelMenuActions
        loading={loading}
        showForm={showFormCreateSlot}
        showCalendar={showCalendar}
        onQuickSearch={handleQuickSearch}
        onDirectLink={handleDirectLink}
        onToggleCalendar={() => {
          setShowCalendar(!showCalendar)
          if (showFormCreateSlot) setShowFormCreateSlot(false)
        }}
        onToggleFormCreateSlot={() => {
          setShowFormCreateSlot(!showFormCreateSlot)
          if (showCalendar) setShowCalendar(false)
        }}
      />

      <div className={styles.calendar_wrapper_block}>
        {showFormCreateSlot && (
          <CalendarCreateSlot
            myActiveSlots={myActiveSlots}
            onSubmitSlot={handleCalendarSubmit}
            onUpdateSlot={handleUpdateSlot}
            onDeleteSlot={handleCancelSlot}
          />
        )}
        {showCalendar && (
          <CalendarSlotsList
            calendarRooms={calendarRooms}
            myActiveSlots={myActiveSlots}
            currentUserId={user._id}
            onBookSlot={handleBookSlot}
          />
        )}
      </div>
    </div>
  )
}
export default LiveDuelSelection
