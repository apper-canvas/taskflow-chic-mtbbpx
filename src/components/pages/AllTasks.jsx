import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import TaskList from '@/components/organisms/TaskList'
import TaskModal from '@/components/organisms/TaskModal'
import FilterToolbar from '@/components/organisms/FilterToolbar'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import taskService from '@/services/api/taskService'
import categoryService from '@/services/api/categoryService'

const AllTasks = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    status: '',
    showCompleted: false
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  const handleTaskEdit = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setShowTaskModal(true)
  }

  const handleModalSubmit = (task) => {
    if (selectedTask) {
      handleTaskUpdate(task)
    } else {
      setTasks(prev => [task, ...prev])
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleBulkComplete = async () => {
    const incompleteTasks = tasks.filter(task => !task.completed)
    if (incompleteTasks.length === 0) {
      toast.info('All tasks are already completed!')
      return
    }

    if (!window.confirm(`Mark ${incompleteTasks.length} tasks as completed?`)) {
      return
    }

    try {
      const updatePromises = incompleteTasks.map(task =>
        taskService.update(task.Id, { completed: true })
      )
      
      const updatedTasks = await Promise.all(updatePromises)
      
      setTasks(prev => prev.map(task => {
        const updated = updatedTasks.find(ut => ut.Id === task.Id)
        return updated || task
      }))
      
      toast.success(`${incompleteTasks.length} tasks completed! 🎉`)
    } catch (error) {
      toast.error('Failed to complete tasks')
    }
  }

  const handleBulkDelete = async () => {
    const completedTasks = tasks.filter(task => task.completed)
    if (completedTasks.length === 0) {
      toast.info('No completed tasks to delete')
      return
    }

    if (!window.confirm(`Delete ${completedTasks.length} completed tasks? This cannot be undone.`)) {
      return
    }

    try {
      const deletePromises = completedTasks.map(task => taskService.delete(task.Id))
      await Promise.all(deletePromises)
      
      setTasks(prev => prev.filter(task => !task.completed))
      toast.success(`${completedTasks.length} tasks deleted`)
    } catch (error) {
      toast.error('Failed to delete tasks')
    }
  }

  const incompleteTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Filter Toolbar - moved to separate component in Layout */}
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
                All Tasks
              </h1>
              <p className="text-gray-600">
                Manage all your tasks in one place
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {incompleteTasks.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon="CheckCheck"
                  onClick={handleBulkComplete}
                >
                  Mark All Complete
                </Button>
              )}
              
              {completedTasks.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  icon="Trash2"
                  onClick={handleBulkDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete Completed
                </Button>
              )}
              
              <Button
                variant="primary"
                size="lg"
                icon="Plus"
                onClick={handleCreateTask}
              >
                Add Task
              </Button>
            </div>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated" className="p-4 text-center">
                <div className="text-2xl font-bold text-taskflow-purple">
                  {tasks.length}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated" className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {incompleteTasks.length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="elevated" className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedTasks.length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="elevated" className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
{tasks.filter(task => {
                    if (!task.due_date || task.completed) return false
                    return new Date(task.due_date) < new Date()
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </Card>
            </motion.div>
          </div>

          {/* Task List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TaskList
              tasks={tasks}
              categories={categories}
              loading={loading}
              error={error}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={handleTaskEdit}
              onCreateTask={handleCreateTask}
              filters={filters}
              showCategory={true}
            />
          </motion.div>

          {/* Task Modal */}
          <TaskModal
            isOpen={showTaskModal}
            onClose={() => setShowTaskModal(false)}
            task={selectedTask}
            onSubmit={handleModalSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default AllTasks