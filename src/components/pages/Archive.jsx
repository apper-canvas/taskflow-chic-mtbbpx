import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import TaskList from '@/components/organisms/TaskList'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import EmptyState from '@/components/molecules/EmptyState'
import taskService from '@/services/api/taskService'
import categoryService from '@/services/api/categoryService'

const Archive = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      
      // Filter only completed tasks
      const completedTasks = tasksData.filter(task => task.completed)
      setTasks(completedTasks)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load archived tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    if (!updatedTask.completed) {
      // If task is uncompleted, remove from archive
      setTasks(prev => prev.filter(task => task.Id !== updatedTask.Id))
      toast.success('Task moved back to active list')
    } else {
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ))
    }
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  const handleBulkDelete = async () => {
    if (tasks.length === 0) {
      toast.info('No completed tasks to delete')
      return
    }

    if (!window.confirm(`Delete all ${tasks.length} completed tasks? This cannot be undone.`)) {
      return
    }

    try {
      const deletePromises = tasks.map(task => taskService.delete(task.Id))
      await Promise.all(deletePromises)
      
      setTasks([])
      toast.success(`${tasks.length} tasks deleted from archive`)
    } catch (error) {
      toast.error('Failed to delete tasks')
    }
  }

  const handleRestoreAll = async () => {
    if (tasks.length === 0) {
      toast.info('No tasks to restore')
      return
    }

    if (!window.confirm(`Restore all ${tasks.length} tasks to active list?`)) {
      return
    }

    try {
      const updatePromises = tasks.map(task =>
        taskService.update(task.Id, { completed: false })
      )
      
      await Promise.all(updatePromises)
      setTasks([])
      toast.success(`${tasks.length} tasks restored to active list`)
    } catch (error) {
      toast.error('Failed to restore tasks')
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 mx-auto mb-4"
          >
            <ApperIcon name="Loader2" size={32} className="text-taskflow-purple" />
          </motion.div>
          <p className="text-gray-600">Loading archived tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load archive</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="outline" onClick={loadData} icon="RefreshCw">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Completed Tasks Archive
            </h1>
            <p className="text-gray-600">
              View and manage your completed tasks
            </p>
          </div>

          <EmptyState
            icon="Archive"
            title="No completed tasks yet"
            description="Complete some tasks to see them appear in your archive"
            actionLabel="Go to Dashboard"
            onAction={() => window.location.href = '/dashboard'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Completed Tasks Archive
            </h1>
            <p className="text-gray-600">
              {tasks.length} completed task{tasks.length !== 1 ? 's' : ''} in your archive
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon="RotateCcw"
              onClick={handleRestoreAll}
            >
              Restore All
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon="Trash2"
              onClick={handleBulkDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete All
            </Button>
          </div>
        </div>

        {/* Archive Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-taskflow-purple">
                {tasks.filter(task => task.completedAt && 
                  new Date(task.completedAt).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated" className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(task => task.completedAt && 
                  new Date(task.completedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </Card>
          </motion.div>
        </div>

        {/* Completed Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Archive" size={18} className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Archived Tasks
              </h2>
            </div>

            <TaskList
              tasks={tasks}
              categories={categories}
              loading={false}
              error={null}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={() => {}} // Disable editing in archive
              showCategory={true}
              filters={{ showCompleted: true }} // Always show completed in archive
            />
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Archive