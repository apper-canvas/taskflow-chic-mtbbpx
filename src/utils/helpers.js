export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export const isOverdue = (dueDate) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getPriorityColor = (priority) => {
  const colors = {
    low: '#10B981',
    medium: '#3B82F6',
    high: '#F59E0B',
    urgent: '#EF4444'
  }
  return colors[priority] || colors.medium
}

export const getPriorityGradient = (priority) => {
  const gradients = {
    low: 'from-green-500 to-green-400',
    medium: 'from-blue-500 to-blue-400',
    high: 'from-amber-500 to-amber-400',
    urgent: 'from-red-500 to-red-400'
  }
  return gradients[priority] || gradients.medium
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}