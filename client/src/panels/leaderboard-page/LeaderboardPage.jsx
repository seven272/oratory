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
      <h1>Рейтинг лучших ораторов</h1>
      <Leaderboard />
      <Footer />
    </Panel>
  )
}

export default LeaderboardPage
