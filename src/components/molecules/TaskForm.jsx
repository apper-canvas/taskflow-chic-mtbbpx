import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import TextArea from '@/components/atoms/TextArea'
import Select from '@/components/atoms/Select'
import taskService from '@/services/api/taskService'
import categoryService from '@/services/api/categoryService'

const TaskForm = ({ 
  task = null, 
  onSubmit, 
  onCancel,
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadCategories()
    if (task) {
setFormData({
        title: task.title || '',
        description: task.description || '',
        categoryId: task.category_id?.toString() || '',
        priority: task.priority || 'medium',
        dueDate: task.due_date || ''
      })
    }
  }, [task])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
const taskData = {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.categoryId, 10),
        priority: formData.priority,
        due_date: formData.dueDate
      }
      
      let result
      if (task) {
        result = await taskService.update(task.Id, taskData)
        toast.success('Task updated successfully')
      } else {
        result = await taskService.create(taskData)
        toast.success('Task created successfully')
      }
      
      onSubmit?.(result)
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setLoading(false)
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
    label: cat.Name
  }))
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <Input
        label="Task Title"
        value={formData.title}
        onChange={handleInputChange('title')}
        placeholder="Enter task title..."
        error={errors.title}
        required
      />

      <TextArea
        label="Description"
        value={formData.description}
        onChange={handleInputChange('description')}
        placeholder="Add task description (optional)..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.categoryId}
          onChange={handleInputChange('categoryId')}
          options={categoryOptions}
          placeholder="Select category"
          error={errors.categoryId}
          required
        />

        <Select
          label="Priority"
          value={formData.priority}
          onChange={handleInputChange('priority')}
          options={priorityOptions}
          required
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={handleInputChange('dueDate')}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default TaskForm