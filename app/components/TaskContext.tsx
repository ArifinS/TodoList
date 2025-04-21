"use client";
import { createContext, useContext } from "react";

interface Task {
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
  addTask: (task: { title: string; description: string; tags: string }) => void;
  deleteTask: (index: number) => void;
  deleteAllTasks: () => void;
  editTask: (index: number, title: string, description: string) => void;
  toggleStar: (index: number) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};