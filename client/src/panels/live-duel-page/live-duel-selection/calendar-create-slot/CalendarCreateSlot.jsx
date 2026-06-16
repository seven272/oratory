import React, { useState } from 'react'

import MyActiveSlot from './my-active-slot/MyActiveSlot'
import styles from './CalendarCreateSlot.module.css'

const CalendarCreateSlot = ({
  myActiveSlots,
  onSubmitSlot,
  onUpdateSlot,
  onDeleteSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState('')
  // const [editingSlotId, setEditingSlotId] = useState(null)
  // const [editDate, setEditDate] = useState('')

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (!selectedDate) return
    onSubmitSlot(selectedDate)
    setSelectedDate('')
  }


  return (
    <div className={styles.calendar_wrapper}>
      {/* Форма создания слота */}
      <form className={styles.calendar_box} onSubmit={handleSubmit}>
        <label className={styles.calendar_label}>
          Предложить свое время для дуэли (Лимит: максимум 3 слота):
        </label>
        <div className={styles.input_group}>
          <input
            type="datetime-local"
            className={styles.calendar_input}
            value={selectedDate}
            onChange={(evt) => setSelectedDate(evt.target.value)}
            required
            disabled={myActiveSlots.length >= 3}
          />
          <button
            type="submit"
            className={styles.calendar_submit_btn}
            disabled={myActiveSlots.length >= 3}
          >
            Опубликовать слот
          </button>
        </div>
        {myActiveSlots.length >= 3 && (
          <p className={styles.limit_warning}>
            Вы исчерпали лимит активных слотов (макс. 3)
          </p>
        )}
      </form>

      {/* Список Своих Созданных Слотов */}
      <div className={styles.my_slots_section}>
        <h3 className={styles.slots_title}>
          Ваши активные слоты ({myActiveSlots.length}/3):
        </h3>
        {myActiveSlots.length === 0 ? (
          <p className={styles.no_slots_text}>
            У вас пока нет созданных активных слотов.
          </p>
        ) : (
          <div className={styles.slots_list}>
            {myActiveSlots.map((room) => (
              <MyActiveSlot
                key={room._id}
                room={room}
                onDeleteSlot={onDeleteSlot}
                onUpdateSlot={onUpdateSlot}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarCreateSlot
