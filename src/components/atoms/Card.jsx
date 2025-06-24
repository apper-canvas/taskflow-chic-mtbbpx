import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  borderColor,
  className = '',
  onClick,
  hoverable = false,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200'
  
  const variants = {
    default: 'border border-gray-200',
    elevated: 'shadow-sm border border-gray-100',
    flat: 'border-0'
  }

  const hoverClasses = hoverable || onClick 
    ? 'hover:shadow-md cursor-pointer' 
    : ''

  const borderStyle = borderColor 
    ? { borderLeftColor: borderColor, borderLeftWidth: '4px' }
    : {}

  const cardClasses = `
    ${baseClasses} 
    ${variants[variant]} 
    ${hoverClasses}
    ${className}
  `.trim()

  const CardComponent = onClick ? motion.div : 'div'
  const motionProps = onClick ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    onClick
  } : {}

  return (
    <CardComponent
      className={cardClasses}
      style={borderStyle}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  )
}

export default Card