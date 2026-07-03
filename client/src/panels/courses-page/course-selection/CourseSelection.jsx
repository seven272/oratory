import React, { useState } from 'react'
// Импортируем хук навигации VK-роутера
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import styles from './CourseSelection.module.css'

const COURSES_DATA = [
  {
    code: 'pitch_master',
    title: 'Питч на миллион',
    description:
      'Освойте жесткую аргументацию, избавьтесь от воды в речи и научитесь продавать свои идеи инвесторам за 3 минуты.',
    tag: 'Техника речи',
    reward: '500 XP',
  },
  {
    code: 'hard_negotiations',
    title: 'Жесткие переговоры',
    description:
      'Научитесь держать удар при психологическом давлении, защищать свои границы и закрывать сделки на своих условиях.',
    tag: 'Психология',
    reward: '600 XP',
  },
  {
    code: 'storytelling_pro',
    title: 'Сторителлинг для лидеров',
    description:
      'Превращайте сухие отчеты в захватывающие истории. Научитесь вдохновлять команду и удерживать внимание любой аудитории.',
    tag: 'Влияние',
    reward: '450 XP',
  },
]

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
        {COURSES_DATA.map((course) => {
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
