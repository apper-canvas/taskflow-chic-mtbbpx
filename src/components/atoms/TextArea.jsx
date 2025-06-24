import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const TextArea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  required = false,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  const textAreaClasses = `
    w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
    focus:border-taskflow-purple focus:ring-2 focus:ring-taskflow-purple/20 
    transition-all duration-200 bg-white resize-none
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
      
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={textAreaClasses}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-taskflow-error flex items-center gap-1 mt-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  )
})

TextArea.displayName = 'TextArea'

export default TextArea