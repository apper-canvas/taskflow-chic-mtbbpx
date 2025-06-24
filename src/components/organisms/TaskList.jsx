import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'
import EmptyState from '@/components/molecules/EmptyState'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'

const TaskList = ({ 
  tasks = [], 
  categories = [],
  loading = false,
  error = null,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  onCreateTask,
  filters = {},
  showCategory = true,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      )
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Apply status filter
    if (filters.status) {
      const today = new Date().toDateString()
      switch (filters.status) {
        case 'pending':
          filtered = filtered.filter(task => !task.completed)
          break
        case 'overdue':
          filtered = filtered.filter(task => {
            if (!task.dueDate || task.completed) return false
            return new Date(task.dueDate) < new Date()
          })
          break
        case 'due-today':
          filtered = filtered.filter(task => {
            if (!task.dueDate || task.completed) return false
            return new Date(task.dueDate).toDateString() === today
          })
          break
      }
    }

    // Apply completed filter
    if (!filters.showCompleted) {
      filtered = filtered.filter(task => !task.completed)
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31')
          bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31')
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [tasks, filters, sortBy, sortOrder])

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  if (loading) {
    return <SkeletonLoader count={5} className={className} />
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
        className={className}
      />
    )
  }

  if (filteredTasks.length === 0 && tasks.length === 0) {
    return (
      <EmptyState
        icon="CheckSquare"
        title="No tasks yet"
        description="Create your first task to get started on your productivity journey"
        actionLabel="Create Task"
        onAction={onCreateTask}
        className={className}
      />
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        icon="Search"
        title="No matching tasks"
        description="Try adjusting your filters or search terms"
        actionLabel="Clear Filters"
        onAction={() => window.location.reload()}
        className={className}
      />
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex gap-1">
            {[
              { key: 'createdAt', label: 'Date' },
              { key: 'priority', label: 'Priority' },
              { key: 'dueDate', label: 'Due Date' },
              { key: 'title', label: 'Title' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={sortBy === key ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleSort(key)}
                icon={sortBy === key ? (sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown') : undefined}
                iconPosition="right"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <AnimatePresence mode="popLayout">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              delay: index * 0.05,
              layout: { duration: 0.3 }
            }}
          >
            <TaskCard
              task={task}
              category={getCategoryById(task.categoryId)}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              onTaskEdit={onTaskEdit}
              showCategory={showCategory}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList