import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { formatDate, isOverdue, getDaysUntilDue } from '@/utils/helpers'
import taskService from '@/services/api/taskService'

const TaskCard = ({ 
  task, 
  category,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  showCategory = true 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleComplete = async (completed) => {
    if (isCompleting) return
    
    setIsCompleting(true)
    
    try {
      if (completed) {
        // Show confetti animation
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 600)
      }
      
      const updatedTask = await taskService.update(task.Id, { completed })
      onTaskUpdate?.(updatedTask)
      
      if (completed) {
        toast.success('Task completed! 🎉')
      }
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await taskService.delete(task.Id)
      onTaskDelete?.(task.Id)
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

const overdue = isOverdue(task.due_date)
  const daysUntilDue = getDaysUntilDue(task.due_date)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">🎉</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card
        variant="elevated"
        borderColor={category?.color}
        className={`p-4 ${task.completed ? 'opacity-75' : ''}`}
        hoverable
        onClick={() => onTaskEdit?.(task)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="flex-shrink-0 mt-0.5">
            <Checkbox
              checked={task.completed}
              onChange={handleComplete}
              disabled={isCompleting}
              size="md"
            />
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-gray-900 mb-1 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${
                    task.completed ? 'line-through' : ''
                  }`}>
                    {task.description}
                  </p>
                )}

                {/* Badges Row */}
<div className="flex flex-wrap items-center gap-2">
                  {showCategory && category && (
                    <Badge
                      text={category.Name || category.name}
                      color={category.color}
                      size="xs"
                    />
                  )}
                  
                  <Badge priority={task.priority} size="xs" />
{task.due_date && (
                    <Badge
                      text={formatDate(task.due_date)}
                      variant={overdue ? 'error' : daysUntilDue <= 1 ? 'warning' : 'default'}
                      size="xs"
                    />
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTaskEdit?.(task)
                  }}
                  className="p-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="p-1 text-taskflow-error hover:bg-red-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Due Date Warning */}
        {overdue && !task.completed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-xs text-taskflow-error bg-red-50 px-3 py-2 rounded-md"
          >
            <ApperIcon name="AlertTriangle" size={14} />
            <span>Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

export default TaskCard