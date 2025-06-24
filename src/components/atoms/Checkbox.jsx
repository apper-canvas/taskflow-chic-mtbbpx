import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const checkboxClasses = `
    ${sizes[size]} 
    border-2 border-gray-300 rounded cursor-pointer transition-all duration-200
    ${checked 
      ? 'bg-taskflow-purple border-taskflow-purple' 
      : 'bg-white hover:border-taskflow-purple'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim()

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  return (
    <motion.div
      className={checkboxClasses}
      onClick={handleClick}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <motion.div
        initial={false}
        animate={checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-full h-full flex items-center justify-center"
      >
        <ApperIcon 
          name="Check" 
          size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} 
          className="text-white" 
        />
      </motion.div>
    </motion.div>
  )
}

export default Checkbox