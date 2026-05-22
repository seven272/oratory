import {
  useRouteNavigator,
  useParams,
  useSearchParams
} from '@vkontakte/vk-mini-apps-router'
import { Panel } from '@vkontakte/vkui'

import { All_EXERCISES } from '../../assets/mocks/exercises'
import styles from './ExercisePage.module.css'
import ExerciseRenderer from '../../components/exercise-renderer/ExerciseRenderer'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'

const ExercisePage = ({ id }) => {
  const routerNavigator = useRouteNavigator()
  const params = useParams()
  const [queryParams] = useSearchParams()
  const isDaily = queryParams.get('daily') === 'true'

  //  Находим иконку из статического конфига по alias
  const exerciseData =  params?.alias ? Object.values(All_EXERCISES)
    .flat()
    .find((ex) => ex.alias.toString() === params?.alias.toString()) : null

  const handleGoBack = () => {
    routerNavigator.back()
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
            ← Назад
          </button>
          <div className={styles.exercise_wrapper}>
            <ExerciseRenderer exercise={exerciseData} isDaily={isDaily}/>
          </div>
        </div>
      </div>
      <Footer />
    </Panel>
  )
}

export default ExercisePage
