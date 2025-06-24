import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryPill = ({ 
  category, 
  isActive = false, 
  onClick, 
  showCount = true,
  className = '' 
}) => {
  const pillClasses = `
    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
    ${isActive 
      ? 'text-white shadow-lg' 
      : 'text-gray-700 hover:bg-gray-50'
    }
    ${className}
  `.trim()

  const style = isActive ? { backgroundColor: category.color } : {}

  return (
    <motion.div
      className={pillClasses}
      style={style}
      onClick={() => onClick?.(category)}
      whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex-shrink-0">
        <ApperIcon 
          name={category.icon} 
          size={18} 
          className={isActive ? 'text-white' : 'text-gray-500'}
        />
      </div>
      
<div className="flex-1 min-w-0">
        <span className="font-medium text-sm">{category.Name || category.name}</span>
      </div>
      
      {showCount && (
        <div className={`
          flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium
          ${isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 text-gray-600'
          }
`}>
          {category.task_count || category.taskCount || 0}
        </div>
      )}
    </motion.div>
  )
}

export default CategoryPill