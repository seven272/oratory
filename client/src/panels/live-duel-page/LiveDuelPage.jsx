import { Panel } from '@vkontakte/vkui'

import styles from './LiveDuelPage.module.css'

import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import LiveDuelContainer from './live-duel-container/LiveDuelContainer'

const LiveDuelPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.live_duel}>
        <LiveDuelContainer />
      </div>
      <Footer />
    </Panel>
  )
}

export default LiveDuelPage