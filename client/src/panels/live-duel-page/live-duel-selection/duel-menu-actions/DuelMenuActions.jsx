import React from 'react'
import styles from './DuelMenuActions.module.css'

const DuelMenuActions = ({
  loading,
  showForm,
  showCalendar,
  onQuickSearch,
  onDirectLink,
  onToggleCalendar,
  onToggleFormCreateSlot
}) => {
  return (
    <div className={styles.menu_list}>
      <button
        className={styles.menu_button_primary}
        onClick={onQuickSearch}
        disabled={loading}
      >
        {loading ? 'Инициализация...' : '⚡ Быстрый поиск пары'}
      </button>

      <button
        className={styles.menu_button_secondary}
        onClick={onDirectLink}
        disabled={loading}
      >
        🔗 Создать ссылку-приглашение
      </button>

      <button
        className={styles.menu_button_secondary}
        onClick={onToggleFormCreateSlot}
        disabled={loading}
      >
        📅 {showForm ? 'Закрыть форму' : 'Запланировать дуэль'}
      </button>

      <button
        className={styles.menu_button_secondary}
        onClick={onToggleCalendar}
        disabled={loading}
      >
        🔍 {showCalendar ? 'Закрыть список' : 'Найти слот'}
      </button>
    </div>
  )
}

export default DuelMenuActions
