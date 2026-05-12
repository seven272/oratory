import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { FaCheckSquare } from "react-icons/fa";

import { All_EXERCISES } from '../../../assets/mocks/exercises' // Путь к твоему файлу со списком упражнений
import styles from './DailyTaskCard.module.css'

const DailyTaskCard = ({ task }) => {
  const {
    alias,
    title,
    description,
    reward,
    goal,
    currentValue,
    isCompleted,
    locked,
  } = task
  const routeNavigator = useRouteNavigator()

  //  Находим иконку из статического конфига по alias
  const exerciseConfig = Object.values(All_EXERCISES)
    .flat()
    .find((ex) => ex.alias === alias)

  const iconSrc = exerciseConfig?.icon

  const handleClick = () => {
    if (locked) {
      // Здесь можно вызвать открытие модалки Premium
      console.log('Доступно только в Premium')
      return
    }
    if (isCompleted) {
      console.log('Задание уже выполнено')
      return
    }

    // Логика перехода к упражнению.
    // ВАЖНО: передаем флаг isDaily, чтобы бэкенд засчитал стрик
    console.log(`Запуск ${alias} в режиме Daily`)
    routeNavigator.push(`/exercise/${alias}?daily=true`)
  }

  // Динамические классы
  const cardClasses = `
    ${styles.card} 
    ${locked ? styles.locked : ''} 
    ${isCompleted ? styles.completed : ''}
  `.trim()

  return (
    <div className={cardClasses} onClick={handleClick}>
      {/* Бейдж для премиум-задач */}
      {locked && <div className={styles.premiumBadge}>Premium</div>}

      <div className={styles.iconWrapper}>
        <img src={iconSrc} alt={title} className={styles.icon} />
      </div>

      <div className={styles.content}>
        <span className={styles.taskTitle}>{title}</span>
        <span className={styles.description}>{description}</span>
      </div>

      <div className={styles.sideInfo}>
        <span className={styles.reward}>+{reward} XP</span>

        {isCompleted ? (
          <span className={styles.checkIcon}><FaCheckSquare size={20}/> выполнено</span>
        ) : (
          !locked && (
            <span className={styles.progressLabel}>
              {currentValue}/{goal}
            </span>
          )
        )}
      </div>
    </div>
  )
}

export default DailyTaskCard
