import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import categoryService from '@/services/api/categoryService'

const CategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B21B6',
    icon: 'Folder'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const predefinedColors = [
    '#5B21B6', // Purple
    '#3B82F6', // Blue  
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899'  // Pink
  ]

  const predefinedIcons = [
    'Folder', 'Target', 'Code', 'Users', 'Settings',
    'User', 'Briefcase', 'Calendar', 'Mail', 'FileText',
    'BookOpen', 'Heart', 'Star', 'Home', 'ShoppingCart'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }))
  }

  const handleIconSelect = (icon) => {
    setFormData(prev => ({
      ...prev,
      icon
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const categoryData = {
        Name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon,
        Tags: '',
        task_count: 0
      }

      const result = await categoryService.create(categoryData)
      
      if (result) {
        toast.success('Category created successfully!')
        onCategoryCreated?.()
        handleClose()
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        color: '#5B21B6',
        icon: 'Folder'
      })
      setErrors({})
      onClose()
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Category</h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Name */}
              <Input
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                error={errors.name}
                required
                disabled={loading}
              />

              {/* Color Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      disabled={loading}
                      className={`
                        w-10 h-10 rounded-lg border-2 transition-all duration-200
                        ${formData.color === color 
                          ? 'border-gray-900 scale-110' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      style={{ backgroundColor: color }}
                    >
                      {formData.color === color && (
                        <ApperIcon name="Check" size={16} className="text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {predefinedIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleIconSelect(icon)}
                      disabled={loading}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                        ${formData.icon === icon 
                          ? 'border-taskflow-purple bg-taskflow-purple/10' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <ApperIcon 
                        name={icon} 
                        size={18} 
                        className={formData.icon === icon ? 'text-taskflow-purple' : 'text-gray-600'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading || !formData.name.trim()}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Category'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CategoryModal