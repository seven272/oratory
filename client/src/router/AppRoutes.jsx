import { createHashRouter } from '@vkontakte/vk-mini-apps-router';


const routers = [
  {
    path: '/',
    panel: 'main-panel',
    view: 'main_view'
  },
   {
    path: '/auth',
    panel: 'auth-panel',
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
]

const router = createHashRouter(routers);

export default router
