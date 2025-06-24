import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import CategoryPill from '@/components/molecules/CategoryPill'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/molecules/ProgressRing'
import ApperIcon from '@/components/ApperIcon'
import CategoryModal from '@/components/organisms/CategoryModal'
import categoryService from '@/services/api/categoryService'
import taskService from '@/services/api/taskService'
const CategorySidebar = () => {
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      
// Update category task counts
      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        taskCount: tasksData.filter(task => task.category_id === category.Id && !task.completed).length
      }))
      
      setCategories(categoriesWithCounts)
      setTasks(tasksData)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategoryId(category.Id)
    navigate(`/category/${category.Id}`)
  }

  const calculateProgress = () => {
    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  }

  const getTodaysTaskCount = () => {
    const today = new Date().toDateString()
return tasks.filter(task => {
      if (!task.due_date) return false
      return new Date(task.due_date).toDateString() === today && !task.completed
    }).length
  }

  const getOverdueTaskCount = () => {
    const today = new Date()
return tasks.filter(task => {
      if (!task.due_date || task.completed) return false
      return new Date(task.due_date) < today
    }).length
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-taskflow-purple to-taskflow-purple-light rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-600">Stay productive</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-taskflow-surface rounded-xl p-4">
          <div className="flex items-center gap-4">
            <ProgressRing progress={calculateProgress()} size={60} strokeWidth={6} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Daily Progress</h3>
              <p className="text-sm text-gray-600">
                {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex-shrink-0 p-6 space-y-3">
        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Due Today</span>
            <div className="text-xs text-gray-600">{getTodaysTaskCount()} tasks</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, x: 4 }}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/tasks')}
        >
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={16} className="text-red-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">Overdue</span>
            <div className="text-xs text-gray-600">{getOverdueTaskCount()} tasks</div>
          </div>
        </motion.div>
      </div>

{/* Categories */}
<div className="flex-1 overflow-y-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Categories</h2>
          <Button 
            variant="primary" 
            size="sm" 
            icon="Plus"
            onClick={() => setShowModal(true)}
            className="bg-taskflow-purple hover:bg-taskflow-purple-dark text-white shadow-sm"
          >
            Add Category
          </Button>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <CategoryPill
                key={category.Id}
                category={category}
                isActive={selectedCategoryId === category.Id}
                onClick={handleCategorySelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 p-6 border-t border-gray-200">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Archive"
            onClick={() => navigate('/archive')}
            className="w-full justify-start"
          >
            Completed Tasks
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="Settings"
            onClick={() => navigate('/settings')}
            className="w-full justify-start"
          >
            Settings
          </Button>
</div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCategoryCreated={loadData}
      />
    </div>
  )
}

export default CategorySidebar