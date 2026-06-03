import React from 'react'
import { useSelector } from 'react-redux'

import styles from './Achievements.module.css'
import { ALL_ACHIEVEMENTS } from '../../../constants/achievements'
import Achievement from './achievement/Achievement'

const Achievements = () => {
  const userAchievements = useSelector(
    (state) => state.profile.user.achievements || [],
  )

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Достижения</h3>
      <div className={styles.grid}>
        {ALL_ACHIEVEMENTS.map((ach, inx) => {
          return (
            <Achievement
              key={inx}
              userAchievements={userAchievements}
              achievement={ach}
            />
          )
        })}

        {/* {ALL_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = userAchievements.some(
            (ua) => ua.code === ach.code,
          )
          return (
            <div
              key={ach.code}
              className={`${styles.item} ${!isUnlocked ? styles.locked : ''}`}
            >
              <div className={styles.iconBox}>
                <img
                  src={ach.icon}
                  alt={ach.title}
                  className={styles.icon}
                />
              </div>
              <span className={styles.label}>{ach.title}</span>
            </div>
          )
        })} */}
      </div>
    </div>
  )
}

export default Achievements
