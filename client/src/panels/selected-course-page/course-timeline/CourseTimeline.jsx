import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useParams,
  useRouteNavigator,
} from '@vkontakte/vk-mini-apps-router'
import {
  fetchCourseProgress,
  fetchStartCourse,
} from '../../../redux/slices/courseSlice'
import TheoryBlock from '../blocks/theory-block/TheoryBlock'
import AiWorkoutBlock from '../blocks/ai-workout-block/AiWorkoutBlock'
import ExamBlock from '../blocks/exam-block/ExamBlock'
import IrlChallengeBlock from '../blocks/irl-challenge-block/IrlChallengeBlock'
import styles from './CourseTimeline.module.css'
import { COURSES_STATIC_CONTENT } from '../../../assets/data/courses/coursesContent'

const CourseTimeline = () => {
  const { courseCode } = useParams()
  const routeNavigator = useRouteNavigator()
  const dispatch = useDispatch()

  const {
    status,
    currentBlockIndex,
    progressData,
    courseStatus,
    error,
  } = useSelector((state) => state.course)

  //  Достаем текстовый контент конкретного интенсива по его коду
  const courseContent = COURSES_STATIC_CONTENT[courseCode]

  // Массив заголовков для каждого шага
  const STEP_TITLES = [
    courseContent?.theory.title || 'Теория и база',
    courseContent?.ai_workout.title || 'Тренажер с ИИ',
    courseContent?.irl_challenge.title || 'Испытание реальностью',
    courseContent?.exam.title || 'Финальный экзамен',
  ]

  useEffect(() => {
    if (courseCode) {
      dispatch(fetchCourseProgress(courseCode))
    }
  }, [dispatch, courseCode])

  const handleGoBack = () => {
    routeNavigator.back()
  }

  // Защита на случай, если ввели несуществующий в конфиге courseCode
  if (!courseContent) {
    return (
      <div className={styles.error_alert}>
        Контент курса не найден
      </div>
    )
  }

  if (courseStatus === 'loading') {
    return (
      <div className={styles.loader_container}>
        Загрузка интенсива...
      </div>
    )
  }

  // Сценарий 1: Приветственный экран
  if (status === 'not_started') {
    return (
      <div className={styles.welcome_wrapper}>
        <h1 className={styles.course_title}>{courseContent.title}</h1>
        <p className={styles.course_description}>
          {courseContent.description}
        </p>
        <button
          className={styles.primary_button}
          onClick={() => dispatch(fetchStartCourse(courseCode))}
        >
          Начать обучение
        </button>
        <button
          className={styles.secondary_back_button}
          onClick={handleGoBack}
        >
          Назад к выбору курсов
        </button>
      </div>
    )
  }

  // Сценарий 2: Активный курс
  return (
    <div className={styles.timeline_container}>
      {/* Улучшенная двухуровневая шапка */}
      <header className={styles.timeline_header}>
        <div className={styles.top_bar}>
          <button
            className={styles.inline_back_button}
            onClick={handleGoBack}
            aria-label="Назад"
          >
            ‹
          </button>
          <div className={styles.header_info}>
            <span className={styles.step_counter}>
              Шаг {currentBlockIndex + 1} из 4
            </span>
            <h2 className={styles.current_step_title}>
              {STEP_TITLES[currentBlockIndex] || 'Обучение'}
            </h2>
          </div>
          <div className={styles.right_spacer} />{' '}
          {/* Для идеальной центровки заголовка */}
        </div>

        <div className={styles.stepper_container}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`${styles.step_indicator} ${
                index === currentBlockIndex
                  ? styles.step_current
                  : index < currentBlockIndex
                    ? styles.step_completed
                    : ''
              }`}
            />
          ))}
        </div>
      </header>

      {error && <div className={styles.error_alert}>{error}</div>}

      <main className={styles.block_content_area}>
        {currentBlockIndex === 0 && (
          <TheoryBlock courseCode={courseCode} />
        )}
        {currentBlockIndex === 1 && (
          <AiWorkoutBlock
            courseCode={courseCode}
            data={progressData?.blocksProgress?.aiWorkout}
          />
        )}
        {currentBlockIndex === 2 && (
          <IrlChallengeBlock courseCode={courseCode} />
        )}
        {currentBlockIndex === 3 && (
          <ExamBlock
            courseCode={courseCode}
            data={progressData?.blocksProgress?.exam}
          />
        )}
      </main>
    </div>
  )
}

export default CourseTimeline
