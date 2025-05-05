"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskContext, Task } from "./TaskContext";

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const addTask = ({
    title,
    description,
    tags,
    priority,
    dueDate,
  }: {
    title: string;
    description: string;
    tags: string[];
    priority: string;
    dueDate?: Date | null;
  }) => {
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
      dueDate: dueDate || null,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const editTask = (
    id: string,
    title: string,
    description: string,
    tags: string[],
    priority: string,
    dueDate?: Date | null
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
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
    );
  };

  const toggleStar = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, starred: !task.starred } : task))
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