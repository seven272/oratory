import React from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { useSelector } from 'react-redux'
import { FaStar, FaAward } from 'react-icons/fa'

import styles from './PointsUser.module.css'

const PointsUser = () => {
  const routeNavigator = useRouteNavigator()
  const { level, totalPoints } = useSelector((state) => state.user)
  return (
    <div
      className={styles.main_points_user}
      onClick={() => routeNavigator.push('/dashboard')}
    >
      <div className={styles.box}>
        <span className={styles.title}>
          <FaStar size={15} className={styles.icon} /> Уровень
        </span>
        <span className={styles.value}>{level}</span>
      </div>
      <div className={styles.box}>
        <span className={styles.title}>
          <FaAward size={15} className={styles.icon} />
          Очки
        </span>
        <span className={styles.value}>{totalPoints}</span>
      </div>
    </div>
  )
}

export default PointsUser
