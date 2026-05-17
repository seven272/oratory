import { createHashRouter } from '@vkontakte/vk-mini-apps-router'

const routers = [
  {
    path: '/',
    panel: 'main-panel',
    view: 'main_view',
  },
  {
    path: '/auth',
    panel: 'auth-panel',
    view: 'main_view',
  },
  {
    path: '/exercises-daily',
    panel: 'exercises-daily-panel',
    view: 'main_view',
  },
  {
    path: '/exercises-all',
    panel: 'exercises-all-panel',
    view: 'main_view',
  },
    {
    path: '/exercises/:level',
    panel: 'exercises-level-panel',
    view: 'main_view',
  },
  {
    path: '/exercise/:alias',
    panel: 'exercise-page-panel',
    view: 'main_view',
  },
  {
    path: '/dashboard',
    panel: 'dashboard-panel',
    view: 'main_view',
  },
   {
    path: '/leaderboard',
    panel: 'leaderboard-panel',
    view: 'main_view',
  },
  {
    path: '/shop',
    panel: 'shop-panel',
    view: 'main_view',
  },
]

const router = createHashRouter(routers)

export default router
