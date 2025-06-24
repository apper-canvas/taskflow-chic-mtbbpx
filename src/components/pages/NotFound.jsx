import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="h-full flex items-center justify-center bg-taskflow-surface">
      <div className="max-w-md mx-auto text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-taskflow-purple to-taskflow-purple-light rounded-3xl flex items-center justify-center mb-6"
            >
              <ApperIcon name="AlertTriangle" size={48} className="text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-display font-bold text-gradient-purple mb-4"
            >
              404
            </motion.h1>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-3"
          >
            <Button
              variant="primary"
              size="lg"
              icon="Home"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outline"
              size="md"
              icon="ArrowLeft"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Go Back
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-500"
          >
            <p>
              Need help? Check out your{' '}
              <button
                onClick={() => navigate('/tasks')}
                className="text-taskflow-purple hover:underline"
              >
                task list
              </button>{' '}
              or visit the{' '}
              <button
                onClick={() => navigate('/dashboard')}
                className="text-taskflow-purple hover:underline"
              >
                dashboard
              </button>
              .
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound