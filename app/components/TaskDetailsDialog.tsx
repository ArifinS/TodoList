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
import { motion } from "framer-motion";

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
        className="sm:max-w-2xl w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-xl p-8 border border-gray-700/30"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-bold tracking-tight text-white">
              {task.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Detailed information about the task.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium text-white transition-colors duration-200",
                        task.tagColors[index] || "bg-gray-600"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Priority</h3>
                <span
                  className={cn(
                    "inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white",
                    task.priority === "Low" && "bg-gray-600",
                    task.priority === "Medium" && "bg-yellow-500",
                    task.priority === "High" && "bg-green-600"
                  )}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;