import React from 'react'
import { Panel } from '@vkontakte/vkui'

import styles from './LeaderboardPage.module.css'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import Leaderboard from '../../components/leaderboard/Leaderboard'

const LeaderboardPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.leaderboard_page}>
        <Leaderboard />
      </div>

      <Footer />
    </Panel>
  )
}

export default LeaderboardPage
