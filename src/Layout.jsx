import { Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import CategorySidebar from '@/components/organisms/CategorySidebar'
import QuickAddBar from '@/components/organisms/QuickAddBar'
import FilterToolbar from '@/components/organisms/FilterToolbar'
import Button from '@/components/atoms/Button'
import { AuthContext } from './App'

const Layout = () => {
  const location = useLocation()
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header with Logout */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex-1">
            <QuickAddBar />
          </div>
          <div className="flex items-center gap-4 ml-4">
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.name || 'User'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon="LogOut"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex-shrink-0 bg-taskflow-surface border-b border-gray-200 z-30">
        <FilterToolbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto z-40">
          <CategorySidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-taskflow-surface">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout