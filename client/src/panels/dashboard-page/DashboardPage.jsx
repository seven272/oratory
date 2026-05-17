import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfileData } from '../../redux/slices/profileSlice'
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
    loading,
    error,
  } = useSelector((state) => state.profile)

  useEffect(() => {
    dispatch(fetchProfileData())
  }, [dispatch])

  if (loading) return <Spin size="large" fullscreen />
  if (error)
    return (
      <>
        <Header />
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          showIcon
        />
        <Footer />
      </>
    )

  return (
    <Panel id={id}>
      <Header />
      <h1>Привет, {user?.displayName}!</h1>
      <Dashboard
        user={user}
        skills={skills}
        weakPoint={weakPoint}
        recentActivity={recentActivity}
        totalExercises={totalExercises}
      />
      <Footer />
    </Panel>
  )
}

export default DashboardPage
