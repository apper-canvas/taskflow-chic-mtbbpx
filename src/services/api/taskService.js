import tasksData from '../mockData/tasks.json'
import { delay } from '@/utils/helpers'

let tasks = [...tasksData]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id, 10))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(300)
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId || 1,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: tasks.length
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updateData) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updateData,
      Id: tasks[index].Id // Prevent Id modification
    }
    
    // Handle completion logic
    if (updateData.completed !== undefined) {
      updatedTask.completedAt = updateData.completed 
        ? new Date().toISOString() 
        : null
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Task not found')
    }
    const deletedTask = tasks.splice(index, 1)[0]
    return { ...deletedTask }
  },

  async getByCategory(categoryId) {
    await delay(250)
    const categoryTasks = tasks.filter(t => t.categoryId === parseInt(categoryId, 10))
    return [...categoryTasks]
  },

  async search(query) {
    await delay(200)
    const searchResults = tasks.filter(t => 
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    )
    return [...searchResults]
  },

  async bulkDelete(ids) {
    await delay(400)
    const deletedTasks = []
    ids.forEach(id => {
      const index = tasks.findIndex(t => t.Id === parseInt(id, 10))
      if (index !== -1) {
        deletedTasks.push(tasks.splice(index, 1)[0])
      }
    })
    return deletedTasks
  },

  async reorder(taskId, newOrder) {
    await delay(200)
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(taskId, 10))
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    tasks[taskIndex].order = newOrder
    return { ...tasks[taskIndex] }
  }
}

export default taskService