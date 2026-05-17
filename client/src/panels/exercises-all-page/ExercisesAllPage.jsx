import React from 'react'
import { Panel } from '@vkontakte/vkui'

import ExerciseSlider from './exercise-slider/ExerciseSlider'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import styles from './ExercisesAllPage.module.css'
import { All_EXERCISES } from '../../assets/mocks/exercises'

const ExercisesAllPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.main_all_ex}>
        <ExerciseSlider
          titleLvl="Уровень 1: База"
          levelKey="level1"
          exList={All_EXERCISES.level1}
        />
        <ExerciseSlider
          titleLvl="Уровень 2: Продвинутый"
          levelKey="level2"
          exList={All_EXERCISES.level2}
        />
        <ExerciseSlider
          titleLvl="Уровень 3: Эксперт"
          levelKey="level3"
          exList={All_EXERCISES.level3}
        />
      </div>
      <Footer />
    </Panel>
  )
}

export default ExercisesAllPage
