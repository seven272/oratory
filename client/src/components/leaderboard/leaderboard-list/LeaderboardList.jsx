import React from 'react'

import styles from './LeaderboardList.module.css'

const LeaderboardList = ({ user, isCurrent, activeTab }) => {
      const isTopThree = user.rank <= 3
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
 
   return (
     <div
       className={`${styles.row} ${isCurrent ? styles.rowCurrentUser : ''}`}
     >
       <div className={styles.rank}>
         {isTopThree ? medals[user.rank] : user.rank}
       </div>
 
       <img src={user.avatar} alt="avatar" className={styles.avatar} />
 
       <div className={styles.nameContainer}>
         <span className={styles.name}>{user.displayName}</span>
         {user.isPremium && (
           <span className={styles.premiumBadge}>PRO</span>
         )}
       </div>
 
       <div className={styles.stats}>
         <span className={styles.score}>
           {user.score} {activeTab === 'weekly' ? 'WXP' : 'XP'}
         </span>
         <span className={styles.level}>{user.level} ур.</span>
       </div>
     </div>
   )
}

export default LeaderboardList