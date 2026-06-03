import React from 'react'
import { Panel } from '@vkontakte/vkui'

import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import Challenges from './challenges/Challenges'
import styles from './ChallengesPage.module.css'

const ChallengesPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.challenges_page}>
        <Challenges />
      </div>
      <Footer />
    </Panel>
  )
}

export default ChallengesPage
