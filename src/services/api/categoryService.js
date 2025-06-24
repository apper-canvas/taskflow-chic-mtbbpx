import categoriesData from '../mockData/categories.json'
import { delay } from '@/utils/helpers'

let categories = [...categoriesData]

const categoryService = {
  async getAll() {
    await delay(200)
    return [...categories]
  },

  async getById(id) {
    await delay(150)
    const category = categories.find(c => c.Id === parseInt(id, 10))
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  },

  async create(categoryData) {
    await delay(250)
    const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.Id)) : 0
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || '#5B21B6',
      icon: categoryData.icon || 'Folder',
      taskCount: 0
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, updateData) {
    await delay(200)
    const index = categories.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    
    const updatedCategory = {
      ...categories[index],
      ...updateData,
      Id: categories[index].Id // Prevent Id modification
    }
    
    categories[index] = updatedCategory
    return { ...updatedCategory }
  },

  async delete(id) {
    await delay(200)
    const index = categories.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Category not found')
    }
    const deletedCategory = categories.splice(index, 1)[0]
    return { ...deletedCategory }
  },

  async updateTaskCount(categoryId, count) {
    await delay(100)
    const index = categories.findIndex(c => c.Id === parseInt(categoryId, 10))
    if (index !== -1) {
      categories[index].taskCount = count
      return { ...categories[index] }
    }
    throw new Error('Category not found')
  }
}

export default categoryService