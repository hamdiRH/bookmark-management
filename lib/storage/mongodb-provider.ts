import { StorageProvider } from './types';
import dbConnect from '../db';
import Link from '../models/Link';
import PC from '../models/PC';
import Todo from '../models/Todo';
import Category from '../models/Category';

export class MongoDBStorageProvider implements StorageProvider {
  async getLinks() {
    await dbConnect();
    return Link.find().populate('category').sort({ createdAt: -1 });
  }

  async createLink(data: any) {
    await dbConnect();
    return Link.create(data);
  }

  async getPCs() {
    await dbConnect();
    return PC.find().populate('category').sort({ createdAt: -1 });
  }

  async createPC(data: any) {
    await dbConnect();
    return PC.create(data);
  }

  async getTodos() {
    await dbConnect();
    return Todo.find().sort({ createdAt: -1 });
  }

  async createTodo(data: any) {
    await dbConnect();
    return Todo.create(data);
  }

  async getCategories(type?: string) {
    await dbConnect();
    return Category.find(type ? { type } : {}).sort({ name: 1 });
  }

  async createCategory(data: any) {
    await dbConnect();
    return Category.create(data);
  }

  async updateCategory(id: string, data: any) {
    await dbConnect();
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCategory(id: string) {
    await dbConnect();
    await Category.findByIdAndDelete(id);
  }

  async getDepartments() {
    await dbConnect();
    return PC.distinct('department');
  }

  async updateDepartment(oldName: string, newName: string) {
    await dbConnect();
    await PC.updateMany({ department: oldName }, { department: newName });
  }

  async deleteDepartment(name: string) {
    await dbConnect();
    await PC.deleteMany({ department: name });
  }
}