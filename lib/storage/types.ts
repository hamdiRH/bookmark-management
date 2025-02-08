export interface StorageProvider {
  getLinks(): Promise<any[]>;
  createLink(data: any): Promise<any>;
  getPCs(): Promise<any[]>;
  createPC(data: any): Promise<any>;
  getTodos(): Promise<any[]>;
  createTodo(data: any): Promise<any>;
  getCategories(type?: string): Promise<any[]>;
  createCategory(data: any): Promise<any>;
  updateCategory(id: string, data: any): Promise<any>;
  deleteCategory(id: string): Promise<void>;
  getDepartments(): Promise<string[]>;
  updateDepartment(oldName: string, newName: string): Promise<void>;
  deleteDepartment(name: string): Promise<void>;
}

export type StorageType = 'mongodb' | 'json';