import React from 'react'
import { Panel } from '@vkontakte/vkui'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import DailyTasksList from '../../components/daily-tasks-list/DailyTasksList'

const ExercisesDailyPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <h1>Ежедневные упражнения</h1>
      <DailyTasksList />
      <Footer />
    </Panel>
  )
}

export default ExercisesDailyPage
