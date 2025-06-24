import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-taskflow-purple text-white hover:brightness-110 focus:ring-taskflow-purple shadow-sm',
    secondary: 'bg-taskflow-purple-light text-white hover:brightness-110 focus:ring-taskflow-purple-light shadow-sm',
    accent: 'gradient-amber text-white hover:brightness-110 focus:ring-taskflow-amber shadow-sm',
    outline: 'border-2 border-taskflow-purple text-taskflow-purple hover:bg-taskflow-purple hover:text-white focus:ring-taskflow-purple',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-taskflow-error text-white hover:brightness-110 focus:ring-taskflow-error shadow-sm'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  }

  const disabledClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer'

  const buttonClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${disabledClasses}
    ${className}
  `.trim()

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      onClick={handleClick}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="animate-spin" 
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} 
        />
      )}
    </motion.button>
  )
}

export default Button