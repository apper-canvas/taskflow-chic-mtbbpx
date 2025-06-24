import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import CategorySidebar from '@/components/organisms/CategorySidebar'
import QuickAddBar from '@/components/organisms/QuickAddBar'
import FilterToolbar from '@/components/organisms/FilterToolbar'

const Layout = () => {
  const location = useLocation()

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Quick Add Bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
        <QuickAddBar />
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