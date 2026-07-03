import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfileData } from '../../redux/slices/profileSlice'
import { fetchLiveDuelStats } from '../../redux/slices/liveDuelSlice'
import { fetchGetArchiveCourses } from '../../redux/slices/courseSlice'
import { Spin, Alert } from 'antd'
import { Panel } from '@vkontakte/vkui'

import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import Dashboard from './dashboard/Dashboard'

const DashboardPage = ({ id }) => {
  const dispatch = useDispatch()
  const {
    user,
    skills,
    weakPoint,
    recentActivity,
    totalExercises,
    loading: profileLoading,
    error: profileError,
  } = useSelector((state) => state.profile)

  const {
    duelStats,
    statsLoading: duelLoading,
    statsError: duelError,
  } = useSelector((state) => state.liveDuel)

  const { archives } = useSelector((state) => state.course)

  useEffect(() => {
    dispatch(fetchProfileData())
    dispatch(fetchLiveDuelStats())
    dispatch(fetchGetArchiveCourses())
  }, [dispatch])

  if (profileLoading || duelLoading)
    return <Spin size="large" fullscreen />
  // Выводим ошибку, если хоть один упал
  const currentError = profileError || duelError
  if (currentError)
    return (
      <>
        <Header />
        <Alert
          message="Ошибка загрузки данных"
          description={currentError}
          type="error"
          showIcon
        />
        <Footer />
      </>
    )

  return (
    <Panel id={id}>
      <Header />
      <Dashboard
        user={user}
        skills={skills}
        weakPoint={weakPoint}
        recentActivity={recentActivity}
        totalExercises={totalExercises}
        duelStats={duelStats}
        archiveCourses={archives}
      />
      <Footer />
    </Panel>
  )
}

export default DashboardPage
