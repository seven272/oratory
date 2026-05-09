import React from 'react'
import { Spin, Progress, Button, Alert } from 'antd'
import {
  FireOutlined,
  DollarOutlined,
  TrophyOutlined,
  HistoryOutlined,
  StarOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { Radar } from '@ant-design/plots'
import styles from './Dashboard.module.css'

const Dashboard = ({ user, skills, weakPoint, recentActivity, totalExercises }) => {
  if (!skills || !user) {
    return <Spin size="large" fullscreen />
  }

  return (
    <div className={styles.container}>
      {/* 1. СТАТИСТИКА (ВЕРХНЯЯ ПАНЕЛЬ) */}
      <div className={styles.statsGrid}>
        {/* Карточка уровня */}
        <div className={styles.card}>
          <div className={styles.statHeader}>
            <TrophyOutlined className={styles.iconLevel} />
            <span className={styles.statTitle}>Уровень</span>
          </div>
          <div className={styles.statValue}>{user.level}</div>
          <Progress 
            percent={user.levelProgressPercent} 
            size="small" 
            status="active" 
            strokeColor="#faad14" 
          />
          <div className={styles.statSub}>{user.xp} / {user.nextThreshold} XP</div>
        </div>

        {/* Карточка жетонов */}
        <div className={styles.card}>
          <div className={styles.statHeader}>
            <DollarOutlined className={styles.iconCoins} />
            <span className={styles.statTitle}>Жетоны</span>
          </div>
          <div className={styles.statValue}>{user.coins}</div>
          <div className={styles.statSub}>Валюта для курсов</div>
        </div>

        {/* Карточка опыта за все время */}
        <div className={styles.card}>
          <div className={styles.statHeader}>
            <BarChartOutlined className={styles.iconXp} />
            <span className={styles.statTitle}>Общий опыт</span>
          </div>
          <div className={styles.statValue}>{user.lifetimeXp || 0}</div>
          <div className={styles.statSub}>За всё время</div>
        </div>

        {/* Карточка дисциплины */}
        <div className={styles.card}>
          <div className={styles.statHeader}>
            <FireOutlined className={styles.iconStreak} />
            <span className={styles.statTitle}>Стрик</span>
          </div>
          <div className={styles.statValue}>{user.streak} <span className={styles.unit}>дн.</span></div>
          <div className={styles.statSub}>Всего тренировок: {totalExercises || 0}</div>
        </div>
      </div>

      {/* 2. ЦЕНТРАЛЬНЫЙ БЛОК */}
      <div className={styles.mainGrid}>
        {/* График */}
        <div className={`${styles.card} ${styles.radarArea}`}>
          <h3 className={styles.cardTitle}>Анализ навыков</h3>
          <div className={styles.chartWrapper}>
            <Radar
              data={skills}
              xField="subject"
              yField="A"
              area={{ style: { fillOpacity: 0.4 } }}
              meta={{ A: { min: 0, max: 100 } }}
              smooth={true}
            />
          </div>
        </div>

        {/* История */}
        <div className={`${styles.card} ${styles.activityArea}`}>
          <h3 className={styles.cardTitle}>
            <HistoryOutlined /> Последняя активность
          </h3>
          <div className={styles.activityList}>
            {recentActivity?.map((item, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <div className={styles.activityName}>{item.title}</div>
                  <div className={styles.activityScore}>Очков: {item.totalPoints}</div>
                </div>
                <div className={styles.activityCount}>
                  <StarOutlined style={{ color: '#fadb14' }} /> {item.completionsCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ЗОНА РОСТА */}
     {weakPoint && (
  <div className={styles.growthBanner}>
    <div className={styles.growthIcon}>
      <StarOutlined />
    </div>
    <div className={styles.growthInfo}>
      <div className={styles.growthTitle}>Твоя ближайшая цель: {weakPoint.skill}</div>
      <div className={styles.growthDesc}>
        Средний балл здесь {weakPoint.score}%. {weakPoint.recommendation}
      </div>
    </div>
    <div className={styles.growthAction}>
      <Button type="primary" className={styles.growthBtn}>
        Поднажать
      </Button>
    </div>
  </div>
)}
    </div>
  )
}

export default Dashboard
