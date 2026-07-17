import React, { useState } from 'react'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'

import {
  HistoryOutlined,
  DownOutlined,
  UpOutlined,
  RobotOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import styles from './CourseHistory.module.css'

// Масштабируемый объект с алиасами для названий курсов
const COURSE_NAMES = {
  pitch_master: 'Питч на миллион',
  // Сюда можно добавлять новые курсы по мере расширения базы:
  // tech_presentation: 'Техническая презентация',
  // nego_expert: 'Мастер переговоров',
}

const CourseHistory = ({ historyList }) => {
  const routeNavigator = useRouteNavigator()
  const [expandedId, setExpandedId] = useState(null)

  // 1. Отработка пустого состояния с редиректом через VK Router
  if (!historyList || historyList.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.card_title}>
          <HistoryOutlined className={styles.icon_history} /> Архив
          пройденных курсов
        </h3>
        <div className={styles.empty_wrapper}>
          <p className={styles.empty_text}>
            У вас пока нет завершенных или архивных курсов.
          </p>
          <button
            className={styles.route_btn}
            onClick={() => routeNavigator.push('/courses')}
          >
            Перейти к курсам
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    )
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Дата неизвестна'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Дата неизвестна'

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Получаем человекочитаемое название курса по словарю
  const getCourseTitle = (code) => {
    return COURSE_NAMES[code] || code
  }

  // --- РАСЧЕТ СВОДНОЙ СТАТИСТИКИ ---
  // Каждый курс в архиве уже считается завершенным
  const totalCompletedCourses = historyList.length

  // Считаем успешные и проваленные попытки по всем историям всех курсов
  let totalSuccessAttempts = 0
  let totalFailedAttempts = 0

  historyList.forEach((course) => {
    if (course.history && course.history.length > 0) {
      course.history.forEach((attempt) => {
        if (attempt.status === 'completed') {
          totalSuccessAttempts++
        } else {
          totalFailedAttempts++
        }
      })
    }
  })

  return (
    <div className={styles.card}>
      {/* Шапка блока */}
      <h3 className={styles.card_title}>
        <HistoryOutlined className={styles.icon_history} /> Архив
        пройденных курсов
      </h3>

      {/* Верхняя панель расширенной общей статистики */}
      <div className={styles.summary_panel}>
        <div className={styles.summary_item}>
          <TrophyOutlined className={styles.summary_icon_completed} />
          <div className={styles.summary_info}>
            <span className={styles.summary_value}>
              {totalCompletedCourses}
            </span>
            <span className={styles.summary_label}>
              Пройдено курсов
            </span>
          </div>
        </div>
        <div className={styles.summary_item}>
          <CheckCircleOutlined
            className={styles.summary_icon_success}
          />
          <div className={styles.summary_info}>
            <span className={styles.summary_value}>
              {totalSuccessAttempts}
            </span>
            <span className={styles.summary_label}>
              Успешных попыток
            </span>
          </div>
        </div>
        <div className={styles.summary_item}>
          <CloseCircleOutlined
            className={styles.summary_icon_failed}
          />
          <div className={styles.summary_info}>
            <span className={styles.summary_value}>
              {totalFailedAttempts}
            </span>
            <span className={styles.summary_label}>
              Провалено попыток
            </span>
          </div>
        </div>
      </div>

      {/* Список всех курсов */}
      <div className={styles.courses_loop}>
        {historyList.map((course, cIndex) => (
          <div
            key={course._id || course.courseCode || cIndex}
            className={styles.course_section}
          >
            {/* Красивое название курса по словарю */}
            <div className={styles.course_meta_header}>
              <span className={styles.course_code_title}>
                {getCourseTitle(course.courseCode)}
              </span>
              <span
                className={`${styles.course_status_badge} ${course.status === 'completed' ? styles.status_success : styles.status_error}`}
              >
                {course.status === 'completed' ? 'Изучен' : 'Архив'}
              </span>
            </div>

            {/* Хронология попыток внутри этого курса */}
            <div className={styles.timeline}>
              {course.history && course.history.length > 0 ? (
                course.history.map((item, index) => {
                  const isCompleted = item.status === 'completed'
                  const examData = item.blocksProgress?.exam
                  const isExpanded = expandedId === item._id
                  const attemptId = item._id || `${cIndex}-${index}`

                  return (
                    <div
                      key={attemptId}
                      className={`${styles.history_item} ${isExpanded ? styles.item_active : ''}`}
                    >
                      {/* Кликабельная шапка попытки */}
                      <div
                        className={styles.item_header}
                        onClick={() => toggleExpand(attemptId)}
                      >
                        <div className={styles.meta_info}>
                          <span className={styles.attempt_number}>
                            Попытка №{course.history.length - index}
                          </span>
                          <span className={styles.finish_date}>
                            {formatDate(item.finishedAt)}
                          </span>
                        </div>

                        <div className={styles.score_zone}>
                          <span
                            className={`${styles.status_text} ${isCompleted ? styles.status_success : styles.status_error}`}
                          >
                            {isCompleted ? 'Успешно' : 'Не сдано'}
                          </span>
                          <span className={styles.score_value}>
                            {examData?.bestScore || 0}
                            <span className={styles.score_max}>
                              /100
                            </span>
                          </span>
                          <span className={styles.arrow_icon}>
                            {isExpanded ? (
                              <UpOutlined />
                            ) : (
                              <DownOutlined />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Разворачиваемые детали от ИИ */}
                      {isExpanded && (
                        <div className={styles.item_details}>
                          <div className={styles.detail_row}>
                            <span className={styles.detail_label}>
                              Использовано попыток экзамена:
                            </span>
                            <strong className={styles.detail_value}>
                              {examData?.attemptsCount || 0} из 5
                            </strong>
                          </div>

                          {examData?.aiFeedback && (
                            <div className={styles.ai_feedback_block}>
                              <div className={styles.feedback_header}>
                                <RobotOutlined
                                  className={styles.icon_ai}
                                />
                                <span
                                  className={styles.feedback_label}
                                >
                                  Вердикт ИИ:
                                </span>
                              </div>
                              <p className={styles.feedback_text}>
                                {examData.aiFeedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className={styles.no_history_text}>
                  История попыток по этому курсу пуста.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseHistory
