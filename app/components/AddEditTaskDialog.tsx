// components/AddEditTaskDialog.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "./TaskValidation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Notify function
const notify = (message: string, type: "success" | "error" = "success") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
  }
};

interface AddEditTaskDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  isEditing: boolean;
  editingIndex: number | null;
  tasks: any[];
  editTask: (index: number, title: string, description: string, tags: string[], priority: string) => void;
  addTask: (data: TaskFormData) => void;
}

const AddEditTaskDialog: React.FC<AddEditTaskDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  isEditing,
  editingIndex,
  tasks,
  editTask,
  addTask,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      priority: "Medium",
    },
  });

  // ✅ Effect to load data when in edit mode
  useEffect(() => {
    if (isEditing && editingIndex !== null && tasks[editingIndex]) {
      const currentTask = tasks[editingIndex];
      setValue("title", currentTask.title);
      setValue("description", currentTask.description);
      setValue("tags", currentTask.tags.join(","));
      setValue("priority", currentTask.priority);
    } else if (!isEditing) {
      reset(); // Reset form for adding new task
    }
  }, [isEditing, editingIndex, tasks, setValue, reset]);

  const onSubmit = (data: TaskFormData) => {
    const formattedData = {
      ...data,
      tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    if (isEditing && editingIndex !== null) {
      editTask(
        editingIndex,
        formattedData.title,
        formattedData.description,
        formattedData.tags,
        formattedData.priority
      );
    } else {
      addTask(formattedData);
    }
    setDialogOpen(false);
    reset();
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-[#1D212B] to-[#2A2F3B] text-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-700/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              {isEditing ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              Fill out the form to {isEditing ? "update" : "create"} a task.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Title</label>
              <input
                {...register("title")}
                className="w-full px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all duration-200 placeholder-gray-500"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Description</label>
              <textarea
                {...register("description")}
                className="w-full h-28 px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none resize-none transition-all duration-200 placeholder-gray-500"
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Tags (comma-separated)</label>
              <input
                {...register("tags")}
                className="w-full px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all duration-200 placeholder-gray-500"
                placeholder="e.g., work, urgent"
              />
              {errors.tags && (
                <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Priority</label>
              <RadioGroup
                value={watch("priority")}
                onValueChange={(value) => setValue("priority", value)}
                className="flex space-x-4"
              >
                {["Low", "Medium", "High"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={level}
                      id={level.toLowerCase()}
                      className="text-green-500 border-gray-500 focus:ring-green-500"
                    />
                    <Label
                      htmlFor={level.toLowerCase()}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <button
              onClick={() => notify("Successfully added task!", "success")}
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 rounded-lg text-white font-semibold hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/30 transition-all duration-300 cursor-pointer"
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default AddEditTaskDialog;