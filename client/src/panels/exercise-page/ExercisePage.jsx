import {
  useRouteNavigator,
  useParams,
} from '@vkontakte/vk-mini-apps-router'
import { Panel } from '@vkontakte/vkui'

import { All_EXERCISES } from '../../assets/mocks/exercises'
import styles from './ExercisePage.module.css'
import ExerciseRenderer from '../../components/exercise-renderer/ExerciseRenderer'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'

const ExercisePage = ({ id }) => {
  const params = useParams()
  const routerNavigator = useRouteNavigator()

  // Защита от undefined: проверяем, есть ли ключи в params и All_EXERCISES
  const levelData = params?.level ? All_EXERCISES[params.level] : []

  const exerciseData = levelData.find(
    (ex) => ex.alias.toString() === params?.alias.toString(),
  )
  const handleGoBack = () => {
    routerNavigator.back() // Уходим назад в меню
  }

  if (!exerciseData) {
    return (
      <Panel id={id}>
        <Header />
        <div className={styles.main_no_ex}>
  <button className={styles.back_btn} onClick={handleGoBack}>
          ← Назад в меню
        </button>
        <div className={styles.screen}>
          <span>Упражнение не найдено...</span>
        </div>

        </div>
      
        <Footer />
      </Panel>
    )
  }

  return (
    <Panel id={id}>
      <Header />
      <div className={styles.main_exercise_page}>
        <div className={styles.wrapper}>
          <button className={styles.back_btn} onClick={handleGoBack}>
            ← Назад в меню
          </button>
          <div className={styles.exercise_wrapper}>
            <ExerciseRenderer exercise={exerciseData} />
          </div>
        </div>
      </div>
      <Footer />
    </Panel>
  )
}

export default ExercisePage
