// components/TaskDetailsDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";

interface Task {
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: "Low" | "Medium" | "High";
}

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  open,
  onOpenChange,
  task,
}) => {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-5xl text-center bg-gradient-to-br from-[#1D212B] to-[#2A2F3B] text-white rounded-2xl shadow-2xl p-8 border border-gray-700/50"
        style={{ width: "1200px", height: "500px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white text-center">
            Task Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-300 text-center">
            Review the task details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div>
            <p className="w-full py-2.5 rounded-lg text-white text-xl font-semibold">
              {task.title}
            </p>
          </div>
          <div>
            <p className="w-full py-2.5 rounded-lg text-white whitespace-pre-line">
              {task.description}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-white mr-2 ${task.tagColors[index]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-center">
            <span
              className={cn(
                "px-4 py-2 rounded-lg text-white",
                task.priority === "Low" && "bg-gray-700",
                task.priority === "Medium" && "bg-yellow-600",
                task.priority === "High" && "bg-green-600"
              )}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;