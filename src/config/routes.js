import Dashboard from '@/components/pages/Dashboard'
import AllTasks from '@/components/pages/AllTasks'
import Archive from '@/components/pages/Archive'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  allTasks: {
    id: 'allTasks',
    label: 'All Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: AllTasks
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
}

export const routeArray = Object.values(routes)
export default routes