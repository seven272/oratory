import { Panel } from '@vkontakte/vkui'

import styles from './SelectedCoursePage.module.css'
import CourseTimeline from './course-timeline/CourseTimeline'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'


const SelectedCoursePage = ({ id }) => {
  return (
    <Panel id={id}>
      <Header />
      <div className={styles.main_course_page}>
        <CourseTimeline />
      </div>
      <Footer />
    </Panel>
  )
}

export default SelectedCoursePage