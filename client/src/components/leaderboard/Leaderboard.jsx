import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchLeaderboard } from '../../redux/slices/leaderboardSlice' // Твой Thunk, принимающий параметр
import styles from './Leaderboard.module.css'
import LeaderboardList from './leaderboard-list/LeaderboardList'

// const LeaderboardRow = ({ user, isCurrent, activeTab }) => {
//   const isTopThree = user.rank <= 3
//   const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }

//   return (
//     <div
//       className={`${styles.row} ${isCurrent ? styles.rowCurrentUser : ''}`}
//     >
//       <div className={styles.rank}>
//         {isTopThree ? medals[user.rank] : user.rank}
//       </div>

//       <img src={user.avatar} alt="avatar" className={styles.avatar} />

//       <div className={styles.nameContainer}>
//         <span className={styles.name}>{user.displayName}</span>
//         {user.isPremium && (
//           <span className={styles.premiumBadge}>PRO</span>
//         )}
//       </div>

//       <div className={styles.stats}>
//         <span className={styles.score}>
//           {user.score} {activeTab === 'weekly' ? 'WXP' : 'XP'}
//         </span>
//         <span className={styles.level}>{user.level} ур.</span>
//       </div>
//     </div>
//   )
// }

const Leaderboard = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('global') // 'global' | 'weekly'
  const { list, currentUser, status } = useSelector(
    (state) => state.leaderboard,
  )

  useEffect(() => {
    // Передаем текущую вкладку в асинхронный запрос
    dispatch(fetchLeaderboard(activeTab))
  }, [dispatch, activeTab])

  const isUserInTopTen = list.some((u) => u.id === currentUser?.id)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Рейтинг ораторов</h2>

      {/* Переключатель вкладок */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'global' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('global')}
        >
          За всё время
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'weekly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          За неделю
        </button>
      </div>

      {status === 'loading' ? (
        <div className={styles.loader}>
          Загрузка таблицы лидеров...
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {list.map((user) => (
              <LeaderboardList
                key={user.id}
                user={user}
                isCurrent={user.id === currentUser?.id}
                activeTab={activeTab}
              />
            ))}
          </div>

          {!isUserInTopTen && currentUser && (
            <>
              <hr className={styles.divider} />
              <div className={styles.list}>
                <LeaderboardList
                  user={currentUser}
                  isCurrent={true}
                  activeTab={activeTab}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Leaderboard
