import { StorageProvider } from './types';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const INITIAL_DATA_DIR = path.join(DATA_DIR, 'initial');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const PCS_FILE = path.join(DATA_DIR, 'pcs.json');
const TODOS_FILE = path.join(DATA_DIR, 'todos.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile(filePath: string) {
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If the file doesn't exist, try to load initial data
    const fileName = path.basename(filePath);
    const initialFilePath = path.join(INITIAL_DATA_DIR, fileName);
    try {
      const initialData = await fs.readFile(initialFilePath, 'utf-8');
      const parsedData = JSON.parse(initialData);
      // Extract the array from the object (e.g., links from { links: [] })
      const key = Object.keys(parsedData)[0];
      return parsedData[key];
    } catch {
      return [];
    }
  }
}

async function writeJsonFile(filePath: string, data: any) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export class JsonStorageProvider implements StorageProvider {
  async getLinks() {
    return readJsonFile(LINKS_FILE);
  }

  async createLink(data: any) {
    const links = await this.getLinks();
    const newLink = { ...data, _id: Date.now().toString() };
    links.push(newLink);
    await writeJsonFile(LINKS_FILE, links);
    return newLink;
  }

  async getPCs() {
    return readJsonFile(PCS_FILE);
  }

  async createPC(data: any) {
    const pcs = await this.getPCs();
    const newPC = { ...data, _id: Date.now().toString() };
    pcs.push(newPC);
    await writeJsonFile(PCS_FILE, pcs);
    return newPC;
  }

  async getTodos() {
    return readJsonFile(TODOS_FILE);
  }

  async createTodo(data: any) {
    const todos = await this.getTodos();
    const newTodo = { ...data, _id: Date.now().toString() };
    todos.push(newTodo);
    await writeJsonFile(TODOS_FILE, todos);
    return newTodo;
  }

  async getCategories(type?: string) {
    const categories = await readJsonFile(CATEGORIES_FILE);
    return type ? categories.filter((c: any) => c.type === type) : categories;
  }

  async createCategory(data: any) {
    const categories = await this.getCategories();
    const newCategory = { ...data, _id: Date.now().toString() };
    categories.push(newCategory);
    await writeJsonFile(CATEGORIES_FILE, categories);
    return newCategory;
  }

  async updateCategory(id: string, data: any) {
    const categories = await this.getCategories();
    const index = categories.findIndex((c: any) => c._id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data };
      await writeJsonFile(CATEGORIES_FILE, categories);
      return categories[index];
    }
    throw new Error('Category not found');
  }

  async deleteCategory(id: string) {
    const categories = await this.getCategories();
    const filtered = categories.filter((c: any) => c._id !== id);
    await writeJsonFile(CATEGORIES_FILE, filtered);
  }

  async getDepartments() {
    const pcs = await this.getPCs();
    return [...new Set(pcs.map((pc: any) => pc.department))].sort();
  }

  async updateDepartment(oldName: string, newName: string) {
    const pcs = await this.getPCs();
    const updated = pcs.map((pc: any) => 
      pc.department === oldName ? { ...pc, department: newName } : pc
    );
    await writeJsonFile(PCS_FILE, updated);
  }

  async deleteDepartment(name: string) {
    const pcs = await this.getPCs();
    const filtered = pcs.filter((pc: any) => pc.department !== name);
    await writeJsonFile(PCS_FILE, filtered);
  }
}