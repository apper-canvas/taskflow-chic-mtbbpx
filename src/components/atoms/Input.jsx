import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
    focus:border-taskflow-purple focus:ring-2 focus:ring-taskflow-purple/20 
    transition-all duration-200 bg-white
    ${error ? 'border-taskflow-error focus:border-taskflow-error focus:ring-taskflow-error/20' : ''}
    ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''}
    ${icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''}
    ${className}
  `.trim()

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-taskflow-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-taskflow-error flex items-center gap-1 mt-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input