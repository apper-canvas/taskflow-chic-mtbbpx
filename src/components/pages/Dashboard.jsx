import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { formatDate, getDaysUntilDue, isOverdue } from "@/utils/helpers";
import categoryService from "@/services/api/categoryService";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import TaskModal from "@/components/organisms/TaskModal";
import TaskList from "@/components/organisms/TaskList";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

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
      toast.error('Failed to load dashboard data')
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

// Dashboard statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const todaysTasks = tasks.filter(task => {
    if (!task.due_date || task.completed) return false
    return new Date(task.due_date).toDateString() === new Date().toDateString()
  })

  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.completed) return false
    return new Date(task.due_date) < new Date()
  })

  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date || task.completed) return false
    const daysUntil = getDaysUntilDue(task.due_date)
    return daysUntil > 0 && daysUntil <= 7
  })

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              You have {pendingTasks} pending task{pendingTasks !== 1 ? 's' : ''} to complete today
            </p>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            icon="Plus"
            onClick={handleCreateTask}
          >
            Add Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-taskflow-purple to-taskflow-purple-light rounded-xl flex items-center justify-center">
                  <ApperIcon name="CheckSquare" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Check" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Clock" size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-4">
                <ProgressRing progress={progressPercentage} size={48} strokeWidth={4} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Due Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="elevated" className="h-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calendar" size={18} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Due Today</h3>
                  <Badge text={todaysTasks.length.toString()} variant="info" size="xs" />
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {todaysTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No tasks due today! 🎉
                    </p>
                  ) : (
                    todaysTasks.slice(0, 3).map(task => (
                      <div
                        key={task.Id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleTaskEdit(task)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge priority={task.priority} size="xs" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {todaysTasks.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{todaysTasks.length - 3} more tasks
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Overdue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="elevated" className="h-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="AlertTriangle" size={18} className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Overdue</h3>
                  <Badge text={overdueTasks.length.toString()} variant="error" size="xs" />
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {overdueTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      All caught up! 👏
                    </p>
                  ) : (
                    overdueTasks.slice(0, 3).map(task => (
                      <div
                        key={task.Id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleTaskEdit(task)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
<div className="flex items-center gap-2 mt-1">
                            <Badge priority={task.priority} size="xs" />
                            <span className="text-xs text-red-600">
                              {Math.abs(getDaysUntilDue(task.due_date))} days overdue
                            </span>
                          </div>
                        </div>
                    ))
                  )}
                  
                  {overdueTasks.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{overdueTasks.length - 3} more tasks
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Upcoming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card variant="elevated" className="h-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Clock" size={18} className="text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">This Week</h3>
                  <Badge text={upcomingTasks.length.toString()} variant="warning" size="xs" />
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {upcomingTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Light week ahead! ✨
                    </p>
                  ) : (
                    upcomingTasks.slice(0, 3).map(task => (
                      <div
                        key={task.Id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleTaskEdit(task)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
<Badge priority={task.priority} size="xs" />
                            <span className="text-xs text-gray-600">
                              {formatDate(task.due_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {upcomingTasks.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{upcomingTasks.length - 3} more tasks
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </div>
            
            <TaskList
              tasks={tasks.slice(0, 5)}
              categories={categories}
              loading={loading}
              error={error}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={handleTaskEdit}
              onCreateTask={handleCreateTask}
              showCategory={true}
            />
          </Card>
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
  )
}

export default Dashboard