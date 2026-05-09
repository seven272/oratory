import { Panel } from '@vkontakte/vkui'

import { All_EXERCISES } from '../../assets/mocks/exercises'
import styles from './Main.module.css'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import PointsUser from '../../components/points-user/PointsUser'
import ExerciseSlider from './exercise-slider/ExerciseSlider'

const Main = ({ id }) => {
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

        <ExerciseSlider
          titleLvl="Уровень 1: База"
          exLvl="level1"
          exList={All_EXERCISES.level1}
        />
        <ExerciseSlider
          titleLvl="Уровень 2: Продвинутый"
          exLvl="level2"
          exList={All_EXERCISES.level2}
        />

        <ExerciseSlider
          titleLvl="Уровень 3: Эксперт"
          exLvl="level3"
          exList={All_EXERCISES.level3}
        />
      </div>

      <Footer />
    </Panel>
  )
}

export default Main
