import React, { useState, useEffect, useRef } from 'react'
import styles from './ExamQuestions.module.css'

const ExamQuestions = ({ isSubmitting, onSubmit, onCancel }) => {
  const [currentCase] = useState({
    title: 'Ситуация: Спасение контракта в лифте',
    description: 'Вы случайно зашли в лифт с генеральным директором компании-клиента, которая завтра планирует расторгнуть с вами договор из-за задержки поставок. У вас есть ровно одна поездка (от 60 до 120 секунд), чтобы применить "Правило 3 секунд", удержать его внимание, снять первичный негатив и договориться о личной встрече сегодня вечером.'
  })

  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showDebugOptions, setShowDebugOptions] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) { handleStopRecording(); return 120; }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isRecording])

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mediaRecorderRef.current.onstop = () => { setAudioBlob(new Blob(audioChunksRef.current, { type: 'audio/wav' })) }

      mediaRecorderRef.current.start()
      setRecordingTime(0)
      setAudioBlob(null)
      setIsRecording(true)
    } catch (err) {
      alert('Микрофон недоступен. Разрешите доступ в браузере.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isTimeValid = recordingTime >= 5 && recordingTime <= 120

  const handlePreSubmit = () => {
    if (!audioBlob) return
    setShowDebugOptions(true)
  }

  return (
    <div className={styles.exam_container}>
      <div className={styles.exam_header}>
        <span className={isRecording ? styles.live_badge_active : styles.live_badge}>
          {isRecording ? 'Идет запись' : 'Запись ответа'}
        </span>
        <button className={styles.cancel_btn} onClick={onCancel} disabled={isSubmitting}>Выйти</button>
      </div>

      <div className={styles.case_card}>
        <h3 className={styles.case_title}>{currentCase.title}</h3>
        <p className={styles.case_text}>{currentCase.description}</p>
      </div>

      <div className={styles.recorder_zone}>
        <div className={styles.timer_display}>
          <span className={`${styles.time} ${isRecording ? styles.pulse : ''}`}>{formatTime(recordingTime)}</span>
          <span className={styles.time_limits}>Требуемый хронометраж: 01:00 — 02:00</span>
        </div>

        <div className={styles.progress_track}>
          <div 
            className={`${styles.progress_bar} ${isTimeValid ? styles.progress_valid : ''}`} 
            style={{ width: `${Math.min((recordingTime / 120) * 100, 100)}%` }} 
          />
          <div className={styles.marker_60s} />
        </div>

        <div className={styles.controls}>
          {!isRecording && !audioBlob && (
            <button type="button" className={styles.record_btn} onClick={handleStartRecording} disabled={isSubmitting}>
              Начать запись
            </button>
          )}
          {isRecording && (
            <button type="button" className={styles.stop_btn} onClick={handleStopRecording}>
              Остановить
            </button>
          )}
          {!isRecording && audioBlob && (
            <div className={styles.review_container}>
              <audio src={URL.createObjectURL(audioBlob)} controls className={styles.audio_player} />
              <button type="button" className={styles.retry_btn} onClick={() => { setAudioBlob(null); setRecordingTime(0); setShowDebugOptions(false); }} disabled={isSubmitting}>
                Удалить и перезаписать
              </button>
            </div>
          )}
        </div>
      </div>

      {recordingTime > 0 && recordingTime < 60 && !isRecording && (
        <p className={styles.warning_text}>Длина аудиозаписи меньше 60 секунд. Пожалуйста, разверните ответ подробнее.</p>
      )}

      {!showDebugOptions ? (
        <button
          type="button"
          className={styles.submit_btn}
          onClick={handlePreSubmit}
          disabled={isRecording || !audioBlob || !isTimeValid || isSubmitting}
        >
          Отправить на оценку ИИ
        </button>
      ) : (
        <div className={styles.debug_panel}>
          <p className={styles.debug_title}>Симуляция вердикта сервера:</p>
          <div className={styles.debug_actions}>
            <button 
              className={styles.debug_btn_pass} 
              disabled={isSubmitting}
              onClick={() => onSubmit({ testMode: 'pass' })}
            >
              Успешная сдача (&gt;= 85)
            </button>
            <button 
              className={styles.debug_btn_fail} 
              disabled={isSubmitting}
              onClick={() => onSubmit({ testMode: 'fail' })}
            >
              Неудовлетворительно (&lt; 85)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamQuestions
