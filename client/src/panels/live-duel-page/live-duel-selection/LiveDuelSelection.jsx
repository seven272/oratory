import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCreateLiveRoom, fetchJoinLiveRoom} from '../../../redux/slices/liveDuelSlice'
import styles from './LiveDuelSelection.module.css'

const LiveDuelSelection = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.liveDuel)
  
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

  // 1. Механика: Быстрый поиск пары
  const handleQuickSearch = () => {
    dispatch(fetchCreateLiveRoom({ creation_type: 'quick_search' }))
      .unwrap()
      .then((data) => {
        // После успешного создания комнаты бэкенд возвращает статус pending.
        // Сразу запускаем поиск существующего игрока Б на этот инстанс
        dispatch(fetchJoinLiveRoom({}))
      })
  }

  // 2. Механика: Генерация ссылки для друга / чата
  const handleDirectLink = () => {
    dispatch(fetchCreateLiveRoom({ creation_type: 'direct_link' }))
  }

  // 3. Механика: Бронирование слота в календаре
  const handleCalendarSubmit = (evt) => {
    evt.preventDefault()
    if (!selectedDate) return

    dispatch(fetchCreateLiveRoom({ 
      creation_type: 'calendar', 
      scheduled_at: selectedDate
    }))
    setShowCalendar(false)
  }

  return (
    <div className={styles.selection_container}>
      <h1 className={styles.main_title}>🎙️ Живые Дуэли</h1>
      <p className={styles.main_description}>
        Практикуйте ораторское мастерство с реальными людьми или ИИ-тренером в режиме реального времени.
      </p>

      {error && <div className={styles.error_banner}>{error}</div>}

      <div className={styles.menu_list}>
        {/* Кнопка: Быстрый поиск */}
        <button 
          className={styles.menu_button_primary} 
          onClick={handleQuickSearch}
          disabled={loading}
        >
          {loading ? 'Инициализация...' : '⚡ Быстрый поиск пары'}
        </button>

        {/* Кнопка: Ссылка для друга */}
        <button 
          className={styles.menu_button_secondary} 
          onClick={handleDirectLink}
          disabled={loading}
        >
          🔗 Создать инвайт-ссылку
        </button>

        {/* Кнопка: Календарь слотов */}
        <button 
          className={styles.menu_button_secondary} 
          onClick={() => setShowCalendar(!showCalendar)}
          disabled={loading}
        >
          📅 Запланировать дуэль
        </button>
      </div>

      {/* Выпадающий блок календаря */}
      {showCalendar && (
        <form className={styles.calendar_box} onSubmit={handleCalendarSubmit}>
          <label className={styles.calendar_label}>Выберите дату и время:</label>
          <input 
            type="datetime-local" 
            className={styles.calendar_input}
            value={selectedDate}
            onChange={(evt) => setSelectedDate(evt.target.value)}
            required
          />
          <button type="submit" className={styles.calendar_submit_btn}>
            Подтвердить запись
          </button>
        </form>
      )}
    </div>
  )
}

export default LiveDuelSelection
