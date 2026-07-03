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
import ChallengesPage from '../panels/challenges-page/ChallengesPage'
import AdminPage from '../panels/admin-page/AdminPage'
import LiveDuelPage from '../panels/live-duel-page/LiveDuelPage'
import LiveDuelJoinPage from '../panels/live-duel-join-page/LiveDuelJoinPage'
import CoursesPage from '../panels/courses-page/CoursesPage'
import SelectedCoursePage from '../panels/selected-course-page/SelectedCoursePage'

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
      <ChallengesPage id="challenges-panel" />
      <AdminPage id="admin-panel" />
      <LiveDuelPage id="live-duel-panel" />
      <LiveDuelJoinPage id="live-duel-join-panel" />
      <CoursesPage id="courses-panel" />
      <SelectedCoursePage id="select-course-panel" />
    </View>
  )
}

export default MainView
