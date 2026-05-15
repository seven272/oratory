/* eslint-disable no-unused-vars */
import React from 'react'
import { View } from '@vkontakte/vkui'

import MainPage from '../panels/main-page/MainPage'
import AuthPage from '../panels/auth-page/AuthPage'
import ExercisePage from '../panels/exercise-page/ExercisePage'
import DashboardPage from '../panels/dashboard-page/DashboardPage'
import ShopPage from '../panels/shop-page/ShopPage'

const MainView = ({ activePanel, id }) => {
  return (
    <View id={id} activePanel={activePanel}>
      <MainPage id="main-panel" />
      <AuthPage id="auth-panel" />
      <ExercisePage id="exercise-page-panel" />
      <DashboardPage id="dashboard-panel" />
      <ShopPage id="shop-panel" />
    </View>
  )
}

export default MainView
