// taskStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Define the Task interface
interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: string;
  starred: boolean;
  dueDate?: Date | null;
}

// Define the store's state and actions
interface TaskStore {
  tasks: Task[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addTask: (data: Omit<Task, 'id' | 'starred' | 'tagColors'>) => void;
  editTask: (
    id: string,
    title: string,
    description: string,
    tags: string[],
    priority: string,
    dueDate?: Date | null
  ) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
  toggleStar: (id: string) => void;
}

// Function to generate random tag colors (based on existing logic, assuming similar behavior)
const generateTagColors = (tags: string[]): string[] => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-yellow-500',
  ];
  return tags.map(() => colors[Math.floor(Math.random() * colors.length)]);
};

// Create the Zustand store
export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
//   search#: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  addTask: (data) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: uuidv4(),
          ...data,
          starred: false,
          tagColors: generateTagColors(data.tags),
        },
      ],
    })),
  editTask: (id, title, description, tags, priority, dueDate) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title,
              description,
              tags,
              priority,
              dueDate,
              tagColors: generateTagColors(tags), // Regenerate colors for new tags
            }
          : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  deleteAllTasks: () => set({ tasks: [] }),
  toggleStar: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, starred: !task.starred } : task
      ),
    })),
}));