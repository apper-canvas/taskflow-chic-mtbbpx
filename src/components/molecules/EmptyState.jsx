import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ 
  icon = 'CheckSquare',
  title = 'No tasks yet',
  description = 'Get started by creating your first task',
  actionLabel = 'Create Task',
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-taskflow-purple to-taskflow-purple-light rounded-xl flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      
      {onAction && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="primary"
            onClick={onAction}
            icon="Plus"
            size="lg"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState