/* eslint-disable no-unused-vars */
import React from 'react'
import { View } from '@vkontakte/vkui'

import Main from '../panels/main/Main'
import Auth from '../panels/auth/Auth'
import ExercisePage from '../panels/exercise-page/ExercisePage'
import DashboardPage from '../panels/dashboard-page/DashboardPage'

const MainView = ({ activePanel, id }) => {
  return (
      <View id={id} activePanel={activePanel} >
        <Main id="main-panel" />
        <Auth id="auth-panel" />
        <ExercisePage id='exercise-page-panel'/>
        <DashboardPage id='dashboard-panel'/>
      </View>
  )
}

export default MainView
