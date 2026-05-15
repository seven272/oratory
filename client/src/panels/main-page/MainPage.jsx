import { Panel } from '@vkontakte/vkui'

import { All_EXERCISES } from '../../assets/mocks/exercises'
import styles from './MainPage.module.css'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import PointsUser from '../../components/points-user/PointsUser'
import DashboardBlock from './dashboard-block/DashboardBlock'
import DailyChallengesBlock from './daily-challenges-block/DailyChallengesBlock'
import ExerciseCatalogBlock from './exercise-catalog-block/ExerciseCatalogBlock'
import LeaderboardShortBlock from './leaderboard-short-block/LeaderboardShortBlock'

import ExerciseSlider from './exercise-slider/ExerciseSlider'
import DailyTasksList from '../../components/daily-tasks-list/DailyTasksList'
import Leaderboard from '../../components/leaderboard/Leaderboard'

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
        <DailyTasksList />
        <div className={styles.border}></div>

        <ExerciseSlider
          titleLvl="Уровень 1: База"
          exList={All_EXERCISES.level1}
        />
        <ExerciseSlider
          titleLvl="Уровень 2: Продвинутый"
          exList={All_EXERCISES.level2}
        />

        <ExerciseSlider
          titleLvl="Уровень 3: Эксперт"
          exList={All_EXERCISES.level3}
        />
      </div>

      <Leaderboard />

      <Footer />
    </Panel>
  )
}

export default MainPage
