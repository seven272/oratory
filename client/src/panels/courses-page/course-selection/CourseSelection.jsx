import React, { useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import styles from './CourseSelection.module.css'
import { ALL_COURSES_LIST } from '../../../assets/data/courses/coursesContent'


const CourseSelection = () => {
  const routeNavigator = useRouteNavigator() // Инициализируем навигатор VK
  const [selectedCourseCode, setSelectedCourseCode] = useState(null)

  const handleSelectCourse = (courseCode) => {
    setSelectedCourseCode(courseCode)
  }

  const handleStartTraining = () => {
    if (selectedCourseCode) {
      // Переходим на панель таймлайна курса, передавая id как параметр роута
      routeNavigator.push(`/course/${selectedCourseCode}`)
    }
  }

  return (
    <div className={styles.selection_container}>
      <h1 className={styles.main_title}>Выберите интенсив</h1>
      <p className={styles.main_description}>
        Пройдите пошаговое обучение с ИИ-тренажерами и прокачайте
        навыки до автоматизма
      </p>

      <div className={styles.courses_list_block}>
        {ALL_COURSES_LIST.map((course) => {
          const isSelected = selectedCourseCode === course.code
          return (
            <div
              key={course.code}
              className={`${styles.course_card} ${isSelected ? styles.course_card_active : ''}`}
              onClick={() => handleSelectCourse(course.code)}
            >
              <div className={styles.card_header}>
                <span className={styles.course_tag}>
                  {course.tag}
                </span>
                <span className={styles.course_reward}>
                  +{course.reward}
                </span>
              </div>
              <h3 className={styles.course_title}>{course.title}</h3>
              <p className={styles.course_text}>
                {course.description}
              </p>
            </div>
          )
        })}
      </div>

      <div className={styles.action_zone}>
        <button
          className={styles.menu_button_primary}
          onClick={handleStartTraining}
          disabled={!selectedCourseCode}
        >
          {selectedCourseCode
            ? 'Перейти к курсу'
            : 'Выберите курс из списка'}
        </button>
      </div>
    </div>
  )
}

export default CourseSelection
