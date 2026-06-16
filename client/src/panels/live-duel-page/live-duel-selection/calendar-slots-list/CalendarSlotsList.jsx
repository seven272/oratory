import React from 'react'
import styles from './CalendarSlotsList.module.css'

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const CalendarSlotsList = ({
  calendarRooms = [],
  myActiveSlots = [],
  currentUserId,
  onBookSlot,
}) => {
  // 1. Объединяем глобальные слоты и личные слоты в единый массив
  // Исключаем дубли на случай, если бэкенд отдал пересекающиеся данные
  const allRoomsMap = new Map()

  calendarRooms.forEach((room) => allRoomsMap.set(room._id, room))
  myActiveSlots.forEach((room) => allRoomsMap.set(room._id, room))

  // 2. Сортируем общий пул от ближайших к дальним по времени
  const combinedSlots = Array.from(allRoomsMap.values()).sort(
    (a, b) => {
      return new Date(a.scheduled_at) - new Date(b.scheduled_at)
    },
  )

  if (combinedSlots.length === 0) {
    return (
      <div className={styles.available_slots_section}>
        <h3 className={styles.slots_title}>
          Доступные запланированные дуэли:
        </h3>
        <p className={styles.no_slots_text}>
          Пока нет активных заявок. Станьте первым, предложив свое
          время в форме выше!
        </p>
      </div>
    )
  }

  return (
    <div className={styles.available_slots_section}>
      <h3 className={styles.slots_title}>Расписание дуэлей:</h3>
      <div className={styles.slots_list}>
        {combinedSlots.map((room) => {
          // Проверяем, принадлежит ли слот текущему авторизованному пользователю
          const isMyOwnSlot =
            room.user_a?._id === currentUserId ||
            room.user_a === currentUserId
          // Проверяем, принят ли вызов (наличие оппонента b или статус active)
          const isAccepted = room.status === 'active' || !!room.user_b

          // Динамически собираем классы для стилизации карточки
          let cardClassName = styles.slot_card
          if (isMyOwnSlot) cardClassName += ` ${styles.slot_card_own}`
          if (isAccepted)
            cardClassName += ` ${styles.slot_card_accepted}`

          return (
            <div key={room._id} className={cardClassName}>
              <div className={styles.slot_info}>
                <div className={styles.meta_header}>
                  <div className={styles.user_profile_meta}>
                    {room.user_a?.avatar && (
                      <img
                        src={room.user_a.avatar}
                        alt={room.user_a.name}
                        className={styles.avatar_mini}
                      />
                    )}
                    <span className={styles.slot_user}>
                      🗣️{' '}
                      {isMyOwnSlot
                        ? 'Вы (Организатор)'
                        : `Оппонент: ${room.user_a?.name || 'Пользователь'}`}
                    </span>
                  </div>

                  {/* Визуальные бейджи-метки статусов */}
                  <div className={styles.badge_container}>
                    {isMyOwnSlot && (
                      <span className={styles.badge_own}>
                        Мой слот
                      </span>
                    )}
                    {isAccepted && (
                      <span className={styles.badge_accepted}>
                        🤝 Вызов принят
                      </span>
                    )}
                  </div>
                </div>

                <span className={styles.slot_time}>
                  📅 {formatDate(room.scheduled_at)}
                </span>
                <span className={styles.slot_topic}>
                  Тема: «{room.topic?.title}»
                </span>
              </div>

              {/* Управление отображением кнопки действия */}
              <div className={styles.action_block}>
                {isAccepted ? (
                  <div className={styles.status_text_accepted}>
                    {isMyOwnSlot
                      ? 'Оппонент найден! Ссылка на звонок появится в назначенное время.'
                      : 'Пара укомплектована.'}
                  </div>
                ) : isMyOwnSlot ? (
                  <div className={styles.status_text_pending}>
                    Ожидание оппонента...
                  </div>
                ) : (
                  <button
                    className={styles.book_slot_btn}
                    onClick={() => onBookSlot(room._id)}
                  >
                    Принять вызов
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarSlotsList
