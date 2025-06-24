import { motion } from 'framer-motion'

const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
  >
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16" />
          <div className="h-5 bg-gray-200 rounded-full animate-pulse w-12" />
        </div>
      </div>
    </div>
  </motion.div>
)

const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader