"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext } from "./TaskContext";

interface Task {
  id: string; 
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: string;
  starred: boolean;
}

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: "Integration API With Api another",
      description:
        "Connect an existing API to a third-party database using secure methods and handle data exchange efficiently.",
      tags: ["Web", "Python", "API"],
      tagColors: ["bg-[#00D991A1]", "bg-[#1C92FFB0]", "bg-[#FE1A1AB5]"],
      priority: "High",
      starred: true,
    },
    {
      id: uuidv4(),
      title: "API Data Synchronization with Python",
      description:
        "Implement a Python solution to synchronize data between an API and a third-party database securely, optimizing data exchange.",
      tags: ["Python", "API", "Data Synchronization"],
      tagColors: ["bg-[#00D991A1]", "bg-[#FE1A1AB5]", "bg-[#BD560BB2]"],
      priority: "Medium",
      starred: false,
    },
    {
      id: uuidv4(),
      title: "Efficient Web API Connectivity in Python",
      description:
        "Develop a Python-based solution for connecting an API to a third-party database securely, focusing on efficient data handling and exchange.",
      tags: ["Web", "Python", "API"],
      tagColors: ["bg-[#00B2D9CC]", "bg-[#8407E6A8]", "bg-[#07AC67D6]"],
      priority: "High",
      starred: false,
    },
    {
      id: uuidv4(),
      title: "Data Handling Data Synchronization",
      description:
        "Integrate a web API with a third-party database using secure methods, focusing on seamless data exchange and data integrity.",
      tags: ["Web", "Python", "Security"],
      tagColors: ["bg-[#2F43F8BF]", "bg-[#AE6D0BDB]", "bg-[#10FBEDB2]"],
      priority: "Medium",
      starred: false,
    },
    {
      id: uuidv4(),
      title: "Data Handling Data Synchronization",
      description:
        "Integrate a web API with a third-party database using secure methods, focusing on seamless data exchange and data integrity.",
      tags: ["Web", "Python", "Security"],
      tagColors: ["bg-[#2F43F8BF]", "bg-[#AE6D0BDB]", "bg-[#10FBEDB2]"],
      priority: "Low",
      starred: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const addTask = ({ title, description, tags, priority}: { title: string; description: string; tags: string[]; priority: string }) => {
    const tagColors = tags.map((_, i) => {
      const colors = ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"];
      return colors[i % colors.length];
    });
    const newTask: Task = {
      id: uuidv4(), 
      title: title || "Untitled Task",
      description: description || "No description",
      tags: tags.length ? tags : ["General"],
      tagColors,
      priority: priority || "Medium",
      starred: false,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const editTask = (index: number, title: string, description: string, tags: string[], priority: string) => {
    setTasks((prev) =>
      prev.map((task, i) => {
        if (i === index) {
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
          };
        }
        return task;
      })
    );
  };

  const toggleStar = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) => (i === index ? { ...task, starred: !task.starred } : task))
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        searchTerm,
        setSearchTerm,
        addTask,
        deleteTask,
        deleteAllTasks,
        editTask,
        toggleStar,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
