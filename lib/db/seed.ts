import mongoose from 'mongoose';
import Category from '../models/Category';
import Link from '../models/Link';
import PC from '../models/PC';
import Todo from '../models/Todo';

const categories = [
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000001'),
    name: 'Development',
    type: 'link',
    createdAt: new Date('2024-01-01')
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000002'),
    name: 'Design',
    type: 'link',
    createdAt: new Date('2024-01-01')
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000003'),
    name: 'Productivity',
    type: 'link',
    createdAt: new Date('2024-01-01')
  }
];

const links = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    description: 'Where the world builds software',
    category: '000000000000000000000001',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb',
    createdAt: new Date('2024-01-01')
  },
  {
    name: 'Figma',
    url: 'https://figma.com',
    description: 'The collaborative interface design tool',
    category: '000000000000000000000002',
    thumbnail: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742',
    createdAt: new Date('2024-01-01')
  },
  {
    name: 'Notion',
    url: 'https://notion.so',
    description: 'All-in-one workspace',
    category: '000000000000000000000003',
    thumbnail: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885',
    createdAt: new Date('2024-01-01')
  }
];

const pcs = [
  {
    name: 'DEV-001',
    department: 'Development',
    createdAt: new Date('2024-01-01')
  },
  {
    name: 'DES-001',
    department: 'Design',
    createdAt: new Date('2024-01-01')
  },
  {
    name: 'HR-001',
    department: 'Human Resources',
    createdAt: new Date('2024-01-01')
  }
];

const todos = [
  {
    title: 'Review Project Proposal',
    description: 'Review and provide feedback on the new project proposal',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-03-30'),
    createdAt: new Date('2024-01-01')
  },
  {
    title: 'Update Documentation',
    description: 'Update the API documentation with new endpoints',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date('2024-03-25'),
    createdAt: new Date('2024-01-01')
  },
  {
    title: 'Weekly Team Meeting',
    description: 'Prepare agenda for weekly team meeting',
    status: 'completed',
    priority: 'low',
    dueDate: new Date('2024-03-20'),
    createdAt: new Date('2024-01-01')
  }
];

export async function seedDatabase() {
  try {
    // Only seed if collections are empty
    const categoriesCount = await Category.countDocuments();
    const linksCount = await Link.countDocuments();
    const pcsCount = await PC.countDocuments();
    const todosCount = await Todo.countDocuments();

    if (categoriesCount === 0) {
      await Category.insertMany(categories);
    }
    
    if (linksCount === 0) {
      await Link.insertMany(links);
    }
    
    if (pcsCount === 0) {
      await PC.insertMany(pcs);
    }
    
    if (todosCount === 0) {
      await Todo.insertMany(todos);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}