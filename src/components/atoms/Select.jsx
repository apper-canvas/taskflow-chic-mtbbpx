import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
    focus:border-taskflow-purple focus:ring-2 focus:ring-taskflow-purple/20 
    transition-all duration-200 bg-white appearance-none cursor-pointer
    ${error ? 'border-taskflow-error focus:border-taskflow-error focus:ring-taskflow-error/20' : ''}
    ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : ''}
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
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={18} className="text-gray-400" />
        </div>
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

Select.displayName = 'Select'

export default Select