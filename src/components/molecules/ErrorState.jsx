import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <div className="w-16 h-16 mx-auto bg-red-100 rounded-xl flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState