import { Panel } from '@vkontakte/vkui'

import styles from './MainPage.module.css'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import PointsUser from '../../components/points-user/PointsUser'
import DashboardBlock from './dashboard-block/DashboardBlock'
import DailyChallengesBlock from './daily-challenges-block/DailyChallengesBlock'
import ExerciseCatalogBlock from './exercise-catalog-block/ExerciseCatalogBlock'
import LeaderboardShortBlock from './leaderboard-short-block/LeaderboardShortBlock'

const MainPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.section_main}>
        <header className={styles.header}>
          <div className={styles.header_poins_wrap}>
            <PointsUser />
          </div>
        </header>
        <div className={styles.line_border}></div>
        <div className={styles.border}></div>
        <DashboardBlock />
        <div className={styles.border}></div>
        <DailyChallengesBlock />
        <div className={styles.border}></div>
        <ExerciseCatalogBlock />
        <div className={styles.border}></div>
        <LeaderboardShortBlock />
        <div className={styles.border}></div>
      </div>
      <Footer />
    </Panel>
  )
}

export default MainPage
