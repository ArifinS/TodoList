"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: string;
  starred: boolean;
  dueDate?: Date | null;
}

interface TaskStore {
  // State
  tasks: Task[];
  searchTerm: string;
  
  // Actions
  setSearchTerm: (term: string) => void;
  addTask: (task: {
    title: string;
    description: string;
    tags: string[];
    priority: string;
    dueDate?: Date | null;
  }) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
  editTask: (
    id: string,
    title: string,
    description: string,
    tags: string[],
    priority: string,
    dueDate?: Date | null
  ) => void;
  toggleStar: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  // Initial state
  tasks: [
    {
      id: uuidv4(),
      title: "Integration API",
      description:
        "Connect an existing API to a third-party database using secure methods and handle data exchange efficiently.",
      tags: ["Web", "Python", "API"],
      tagColors: ["bg-[#00D991A1]", "bg-[#1C92FFB0]", "bg-[#FE1A1AB5]"],
      priority: "High",
      starred: true,
    },
    {
      id: uuidv4(),
      title: "API Data",
      description:
        "Implement a Python solution to synchronize data between an API and a third-party database securely, optimizing data exchange.",
      tags: ["Python", "API", "Data Synchronization"],
      tagColors: ["bg-[#00D991A1]", "bg-[#FE1A1AB5]", "bg-[#BD560BB2]"],
      priority: "Medium",
      starred: false,
    },
    {
      id: uuidv4(),
      title: "Efficient Web",
      description:
        "Develop a Python-based solution for connecting an API to a third-party database securely, focusing on efficient data handling and exchange.",
      tags: ["Web", "Python", "API"],
      tagColors: ["bg-[#00B2D9CC]", "bg-[#8407E6A8]", "bg-[#07AC67D6]"],
      priority: "High",
      starred: false,
    },
    {
      id: uuidv4(),
      title: "Data Handling",
      description:
        "Integrate a web API with a third-party database using secure methods, focusing on seamless data exchange and data integrity.",
      tags: ["Web", "Python", "Security"],
      tagColors: ["bg-[#2F43F8BF]", "bg-[#AE6D0BDB]", "bg-[#10FBEDB2]"],
      priority: "Medium",
      starred: false,
    },
    {
      id: uuidv4(),
      title: "Data Synchronization",
      description:
        "Integrate a web API with a third-party database using secure methods, focusing on seamless data exchange and data integrity.",
      tags: ["Web", "Python", "Security"],
      tagColors: ["bg-[#2F43F8BF]", "bg-[#AE6D0BDB]", "bg-[#10FBEDB2]"],
      priority: "Low", 
      starred: false,
    },
  ],
  searchTerm: "",

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  addTask: (taskData) => set((state) => {
    const tagColors = taskData.tags.map((_, i) => {
      const colors = ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"];
      return colors[i % colors.length];
    });
    
    const newTask: Task = {
      id: uuidv4(),
      title: taskData.title || "Untitled Task",
      description: taskData.description || "No description",
      tags: taskData.tags.length ? taskData.tags : ["General"],
      tagColors,
      priority: taskData.priority || "Medium",
      starred: false,
      dueDate: taskData.dueDate || null,
    };
    
    return { tasks: [...state.tasks, newTask] };
  }),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),
  
  deleteAllTasks: () => set({ tasks: [] }),
  
  editTask: (id, title, description, tags, priority, dueDate) => set((state) => ({
    tasks: state.tasks.map((task) => {
      if (task.id === id) {
        const tagColors = tags.map((_, idx) => {
          const colors = ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"];
          return colors[idx % colors.length];
        });
        
        return {
          ...task,
          title: title || task.title,
          description: description || task.description,
          tags: tags.length ? tags : task.tags,
          tagColors,
          priority: priority || task.priority,
          dueDate: dueDate !== undefined ? dueDate : task.dueDate,
        };
      }
      return task;
    })
  })),
  
  toggleStar: (id) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === id ? { ...task, starred: !task.starred } : task
    )
  })),
}));