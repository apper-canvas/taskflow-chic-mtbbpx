import { toast } from 'react-toastify'

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to load tasks")
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ]
      }
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      toast.error("Failed to load task")
      return null
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: taskData.title,
            title: taskData.title,
            description: taskData.description || '',
            category_id: taskData.category_id || taskData.categoryId,
            priority: taskData.priority || 'medium',
            due_date: taskData.due_date || taskData.dueDate || null,
            completed: false,
            completed_at: null,
            created_at: new Date().toISOString(),
            order: 0
          }
        ]
      }
      
      const response = await apperClient.createRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
      return null
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const recordData = {
        Id: parseInt(id, 10)
      }
      
      // Map fields correctly
      if (updateData.title !== undefined) recordData.title = updateData.title
      if (updateData.description !== undefined) recordData.description = updateData.description
      if (updateData.category_id !== undefined) recordData.category_id = updateData.category_id
      if (updateData.categoryId !== undefined) recordData.category_id = updateData.categoryId
      if (updateData.priority !== undefined) recordData.priority = updateData.priority
      if (updateData.due_date !== undefined) recordData.due_date = updateData.due_date
      if (updateData.dueDate !== undefined) recordData.due_date = updateData.dueDate
      if (updateData.order !== undefined) recordData.order = updateData.order
      
      // Handle completion logic
      if (updateData.completed !== undefined) {
        recordData.completed = updateData.completed
        recordData.completed_at = updateData.completed 
          ? new Date().toISOString() 
          : null
      }
      
      const params = {
        records: [recordData]
      }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
      return null
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      }
      
      const response = await apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
      return false
    }
  },

  async getByCategory(categoryId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        where: [
          {
            FieldName: "category_id",
            Operator: "EqualTo",
            Values: [parseInt(categoryId, 10)]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks by category:", error)
      return []
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "category_id" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "completed" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "created_at" } },
          { field: { Name: "order" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query]
                  }
                ]
              }
            ]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error searching tasks:", error)
      return []
    }
  },

  async bulkDelete(ids) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: ids.map(id => parseInt(id, 10))
      }
      
      const response = await apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.results?.filter(result => result.success) || []
    } catch (error) {
      console.error("Error bulk deleting tasks:", error)
      return []
    }
  },

  async reorder(taskId, newOrder) {
    return this.update(taskId, { order: newOrder })
  }
}

export default taskService