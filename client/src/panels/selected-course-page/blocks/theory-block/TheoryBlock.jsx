import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSubmitTheoryQuiz,
  clearCourseError,
} from '../../../../redux/slices/courseSlice'

import styles from './TheoryBlock.module.css'
import { SLIDES_PITCH_MASTER } from '../../../../assets/data/courses/theorySlides'
import { QUIZ_PITCH_MASTER } from '../../../../assets/data/courses/quizSlides'
import TheoryData from './theory-data/TheoryData'
import TheoryQuiz from './theory-quiz/TheoryQuiz'

const TheoryBlock = ({ courseCode }) => {
  const dispatch = useDispatch()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isQuizStage = currentSlide === SLIDES_PITCH_MASTER.length

  // Сброс ошибки при уходе со страницы (размонтировании всего блока теории)
  useEffect(() => {
    return () => {
      dispatch(clearCourseError())
    }
  }, [dispatch])

  const handleNext = () => {
    if (currentSlide < SLIDES_PITCH_MASTER.length) {
      setCurrentSlide((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
      dispatch(clearCourseError())
    }
  }

  const handleSubmit = async (answerIndex) => {
    setIsSubmitting(true)
    try {
      await dispatch(
        fetchSubmitTheoryQuiz({
          courseCode,
          answerIndex,
        }),
      ).unwrap()
    } catch (err) {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.block_wrapper}>
      {!isQuizStage ? (
        /* СЦЕНАРИЙ 1: Чтение теории */
        <TheoryData
          currentSlide={currentSlide}
          theorySlides={SLIDES_PITCH_MASTER}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : (
        /* СЦЕНАРИЙ 2: Интерактивный Квиз */
        <TheoryQuiz
          quizData={QUIZ_PITCH_MASTER}
          isSubmitting={isSubmitting}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default TheoryBlock
