import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import taskService from '@/services/api/taskService'
import categoryService from '@/services/api/categoryService'

const QuickAddBar = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [priority, setPriority] = useState('medium')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    loadCategories()
    // Auto-focus on mount
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
      if (data.length > 0 && !categoryId) {
        setCategoryId(data[0].Id.toString())
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    if (!categoryId) {
      toast.error('Please select a category')
      return
    }

    setLoading(true)

    try {
      const taskData = {
        title: title.trim(),
        categoryId: parseInt(categoryId, 10),
        priority
      }

      const newTask = await taskService.create(taskData)
      
      // Reset form
      setTitle('')
      setPriority('medium')
      setExpanded(false)
      
      // Refocus input
      if (inputRef.current) {
        inputRef.current.focus()
      }

      onTaskAdded?.(newTask)
      toast.success('Task created successfully! 🎯')
    } catch (error) {
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setExpanded(false)
      setTitle('')
    }
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const categoryOptions = categories.map(cat => ({
    value: cat.Id.toString(),
    label: cat.name
  }))

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Quick Add Input */}
          <div className="flex-1">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Add a new task... (Press Enter to save, Esc to cancel)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setExpanded(true)}
                icon="Plus"
                iconPosition="left"
                className="pr-32"
              />
              
              {/* Inline Actions */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={loading}
                  disabled={!title.trim() || !categoryId}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Options */}
        <motion.div
          initial={false}
          animate={{ 
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categoryOptions}
              placeholder="Select category"
              required
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={priorityOptions}
              required
            />
          </div>
        </motion.div>

        {/* Help Text */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 flex items-center gap-2 text-xs text-gray-500"
          >
            <ApperIcon name="Info" size={12} />
            <span>Pro tip: Use keyboard shortcuts - Enter to save, Esc to cancel</span>
          </motion.div>
        )}
      </form>
    </div>
  )
}

export default QuickAddBar