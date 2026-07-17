import React from 'react'
import { Panel } from '@vkontakte/vkui'

import MiniDashboard from './mini-dashboard/MiniDashboard'
import MiniLeaderboard from './mini-leaderboard/MiniLeaderboard'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import styles from './MiniDashboardPage.module.css'

const MiniDashboardPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.mini_dashboard_page}>
        <MiniDashboard />
        <MiniLeaderboard />
      </div>
      <Footer />
    </Panel>
  )
}

export default MiniDashboardPage
