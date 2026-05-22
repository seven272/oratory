import React from 'react'
import { Panel } from '@vkontakte/vkui'
import { useSelector } from 'react-redux'

import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import DailyTasksList from '../../components/daily-tasks-list/DailyTasksList'
import DailyHeader from './daily-header/DailyHeader'
import DailyCalendar from './daily-calendar/DailyCalendar'
import styles from './ExercisesDailyPage.module.css'

const ExercisesDailyPage = ({ id }) => {
  const completedDays = useSelector(
    (state) => state.profile?.user?.completed_days || [],
  )
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.screen_container}>
        <DailyHeader />
        <DailyCalendar activeDays={completedDays} />
        <DailyTasksList />
      </div>
      <Footer />
    </Panel>
  )
}

export default ExercisesDailyPage
