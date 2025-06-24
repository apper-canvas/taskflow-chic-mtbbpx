import { motion } from 'framer-motion'
import { getPriorityColor, getPriorityGradient, capitalizeFirst } from '@/utils/helpers'

const Badge = ({ 
  text, 
  variant = 'default', 
  priority,
  color,
  size = 'sm',
  className = '' 
}) => {
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  let badgeClasses = `
    inline-flex items-center font-medium rounded-full whitespace-nowrap
    ${sizes[size]}
    ${className}
  `.trim()

  // Priority-based styling
  if (priority) {
    const gradientClass = getPriorityGradient(priority)
    badgeClasses += ` bg-gradient-to-r ${gradientClass} text-white shadow-sm`
  }
  // Color-based styling
  else if (color) {
    badgeClasses += ` text-white shadow-sm`
  }
  // Variant-based styling
  else {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-taskflow-purple text-white',
      secondary: 'bg-taskflow-purple-light text-white',
      success: 'bg-taskflow-success text-white',
      warning: 'bg-taskflow-warning text-white',
      error: 'bg-taskflow-error text-white',
      info: 'bg-taskflow-info text-white'
    }
    badgeClasses += ` ${variants[variant]}`
  }

  const style = color ? { backgroundColor: color } : {}

  return (
    <motion.span
      className={badgeClasses}
      style={style}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
    >
      {priority ? capitalizeFirst(priority) : text}
    </motion.span>
  )
}

export default Badge