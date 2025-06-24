import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import SearchBar from '@/components/molecules/SearchBar'
import ApperIcon from '@/components/ApperIcon'

const FilterToolbar = ({ 
  onFiltersChange,
  searchQuery = '',
  selectedPriority = '',
  selectedStatus = '',
  showCompleted = false
}) => {
  const [filters, setFilters] = useState({
    search: searchQuery,
    priority: selectedPriority,
    status: selectedStatus,
    showCompleted: showCompleted
  })

  useEffect(() => {
    onFiltersChange?.(filters)
  }, [filters, onFiltersChange])

  const handleSearchChange = (search) => {
    setFilters(prev => ({ ...prev, search }))
  }

  const handlePriorityChange = (e) => {
    setFilters(prev => ({ ...prev, priority: e.target.value }))
  }

  const handleStatusChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }))
  }

  const toggleShowCompleted = () => {
    setFilters(prev => ({ ...prev, showCompleted: !prev.showCompleted }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      priority: '',
      status: '',
      showCompleted: false
    })
  }

  const hasActiveFilters = filters.search || filters.priority || filters.status || filters.showCompleted

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const statusOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'due-today', label: 'Due Today' }
  ]

  return (
    <div className="bg-taskflow-surface px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <SearchBar
              placeholder="Search tasks by title or description..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <div className="min-w-0">
              <Select
                value={filters.priority}
                onChange={handlePriorityChange}
                options={priorityOptions}
                className="min-w-32"
              />
            </div>

            {/* Status Filter */}
            <div className="min-w-0">
              <Select
                value={filters.status}
                onChange={handleStatusChange}
                options={statusOptions}
                className="min-w-32"
              />
            </div>

            {/* Show Completed Toggle */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant={filters.showCompleted ? 'primary' : 'ghost'}
                size="sm"
                icon={filters.showCompleted ? 'Eye' : 'EyeOff'}
                onClick={toggleShowCompleted}
              >
                Completed
              </Button>
            </motion.div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 text-sm text-gray-600"
          >
            <ApperIcon name="Filter" size={14} />
            <span>
              {[
                filters.search && `"${filters.search}"`,
                filters.priority && `Priority: ${filters.priority}`,
                filters.status && `Status: ${filters.status}`,
                filters.showCompleted && 'Including completed'
              ].filter(Boolean).join(' • ')}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FilterToolbar