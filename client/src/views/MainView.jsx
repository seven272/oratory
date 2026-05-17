/* eslint-disable no-unused-vars */
import React from 'react'
import { View } from '@vkontakte/vkui'

import MainPage from '../panels/main-page/MainPage'
import AuthPage from '../panels/auth-page/AuthPage'
import ExercisePage from '../panels/exercise-page/ExercisePage'
import DashboardPage from '../panels/dashboard-page/DashboardPage'
import ShopPage from '../panels/shop-page/ShopPage'
import ExercisesDailyPage from '../panels/exercises-daily-page/ExercisesDailyPage'
import ExercisesAllPage from '../panels/exercises-all-page/ExercisesAllPage'
import ExercisesLevelPage from '../panels/exercises-level-page/ExercisesLevelPage'
import LeaderboardPage from '../panels/leaderboard-page/LeaderboardPage'

const MainView = ({ activePanel, id }) => {
  return (
    <View id={id} activePanel={activePanel}>
      <MainPage id="main-panel" />
      <AuthPage id="auth-panel" />
      <ExercisePage id="exercise-page-panel" />
      <DashboardPage id="dashboard-panel" />
      <ShopPage id="shop-panel" />
      <ExercisesDailyPage id="exercises-daily-panel" />
      <ExercisesAllPage id="exercises-all-panel" />
      <ExercisesLevelPage id="exercises-level-panel" />
      <LeaderboardPage id="leaderboard-panel" />
    </View>
  )
}

export default MainView
