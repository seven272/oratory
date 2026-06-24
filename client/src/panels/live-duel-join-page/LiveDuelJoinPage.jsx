import React from 'react'
import { Panel } from '@vkontakte/vkui'

import styles from './LiveDuelJoinPage.module.css'
import LiveDuelJoinHandler from './live-duel-join-handler/LiveDuelJoinHandler'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'

const LiveDuelJoinPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.live_duel_join_page}>
        <LiveDuelJoinHandler />
      </div>

      <Footer />
    </Panel>
  )
}

export default LiveDuelJoinPage
