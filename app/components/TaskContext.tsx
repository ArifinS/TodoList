"use client";
import { createContext, useContext } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: string;
  starred: boolean;
}

interface TaskContextType {
  tasks: Task[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addTask: (task: {
    title: string;
    description: string;
    tags: string[];
    priority: string;
  }) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
  editTask: (
    id: string,
    title: string,
    description: string,
    tags: string[],
    priority: string
  ) => void;
  toggleStar: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

"use client";
import { createContext, useContext } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: string;
  starred: boolean;
  dueDate?: Date | null; // Added dueDate
}

interface TaskContextType {
  tasks: Task[];
  searchTerm: string;
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

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
