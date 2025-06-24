import React, { useEffect, useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/atoms/ApperIcon";
import { motion } from "framer-motion";
const SearchBar = ({ 
  placeholder = 'Search tasks...', 
  value = '', 
  onChange,
  onClear,
  className = '' 
}) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange?.('')
    onClear?.()
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
        icon="Search"
        iconPosition="left"
        className="pr-10"
      />
      
      {localValue && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ApperIcon name="X" size={16} className="text-gray-400" />
        </motion.button>
      )}
    </div>
  )
}

export default SearchBar