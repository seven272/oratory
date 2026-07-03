import { Panel } from '@vkontakte/vkui'

import styles from './CoursesPage.module.css'
import CourseSelection from './course-selection/CourseSelection'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'


const CoursesPage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.main_course_page}>
        <CourseSelection />
      </div>
      <Footer />
    </Panel>
  )
}

export default CoursesPage