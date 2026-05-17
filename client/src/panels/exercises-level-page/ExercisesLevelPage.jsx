import React from 'react'
import { Panel } from '@vkontakte/vkui'
import { useParams } from '@vkontakte/vk-mini-apps-router'

import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import ExercisePreview from '../../components/exercise-preview/ExercisePreview'
import styles from './ExercisesLevelPage.module.css'
import { All_EXERCISES } from '../../assets/mocks/exercises'

const ExercisesLevelPage = ({ id }) => {
  const { level } = useParams()
  const exList = All_EXERCISES[level] || []

  const dictionary = {
    level1: {
      title: 'Уровень 1: база',
      descr:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus sit totam ad, quas excepturi consectetur, a ducimus asperiores doloremque blanditiis sequi itaque ipsam facilis voluptate exercitationem? Quaerat fugit at adipisci.',
    },
    level2: {
      title: 'Уровень 2: продвинутый',
      descr:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus sit totam ad, quas excepturi consectetur, a ducimus asperiores doloremque blanditiis sequi itaque ipsam facilis voluptate exercitationem? Quaerat fugit at adipisci.',
    },
    level3: {
      title: 'Уровень 3: эксперт',
      descr:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus sit totam ad, quas excepturi consectetur, a ducimus asperiores doloremque blanditiis sequi itaque ipsam facilis voluptate exercitationem? Quaerat fugit at adipisci.',
    },
  }
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.level_section}>
        <h3 className={styles.title}>
          {dictionary[level]?.title ?? 'Уровень не найден'}
        </h3>
        <span className={styles.descr}>
          {dictionary[level]?.descr ??
            `Ошибка: для ключа "${level}" нет описания.`}
        </span>
        <div className={styles.list}>
          {exList.map((ex) => (
            <ExercisePreview key={ex.alias} exData={ex} />
          ))}
        </div>
      </div>
      <Footer />
    </Panel>
  )
}

export default ExercisesLevelPage
