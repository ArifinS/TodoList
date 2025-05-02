"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskSchema, TaskFormData } from "./TaskValidation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToastContainer, toast } from "react-toastify"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { DatePicker } from "./DatePicker"
import "react-toastify/dist/ReactToastify.css"

const notify = (message: string, type: "success" | "error" = "success") => {
  switch (type) {
    case "success":
      toast.success(message, { theme: "dark" })
      break
    case "error":
      toast.error(message, { theme: "dark" })
      break
    default:
      toast(message, { theme: "dark" })
  }
}

interface Task {
  id: string
  title: string
  description: string
  tags: string[]
  tagColors: string[]
  priority: string
  starred: boolean
  dueDate?: Date | null
}

interface AddEditTaskDialogProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  isEditing: boolean
  editingTaskId: string | null
  tasks: Task[]
  editTask: (
    id: string,
    title: string,
    description: string,
    tags: string[],
    priority: string,
    dueDate?: Date | null
  ) => void
  addTask: (data: TaskFormData) => void
}

const AddEditTaskDialog: React.FC<AddEditTaskDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  isEditing,
  editingTaskId,
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
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      priority: "Medium",
      dueDate: null,
    },
  })

  useEffect(() => {
    if (isEditing && editingTaskId) {
      const currentTask = tasks.find((task) => task.id === editingTaskId)
      if (currentTask) {
        setValue("title", currentTask.title)
        setValue("description", currentTask.description)
        setValue("tags", currentTask.tags.join(","))
        setValue("priority", currentTask.priority)
        setValue("dueDate", currentTask.dueDate || null)
      }
    } else {
      reset({
        title: "",
        description: "",
        tags: "",
        priority: "Medium",
        dueDate: null,
      })
    }
  }, [isEditing, editingTaskId, tasks, setValue, reset])

  const onSubmit = (data: TaskFormData) => {
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      }

      if (isEditing && editingTaskId) {
        editTask(
          editingTaskId,
          formattedData.title,
          formattedData.description,
          formattedData.tags,
          formattedData.priority,
          formattedData.dueDate
        )
        notify("Successfully updated task!", "success")
      } else {
        addTask(formattedData)
        notify("Successfully added task!", "success")
      }

      setDialogOpen(false)
      reset()
    } catch (error) {
      console.error("Form submission error:", error)
      notify("Failed to process task", "error")
    }
  }

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
              <Label className="block mb-1 text-sm font-medium text-gray-300">Title</Label>
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
              <Label className="block mb-1 text-sm font-medium text-gray-300">Description</Label>
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
              <Label className="block mb-1 text-sm font-medium text-gray-300">Tags (comma-separated)</Label>
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
              <Label className="block mb-1 text-sm font-medium text-gray-300">Due Date</Label>
              <div className="flex items-center gap-2">
                <DatePicker
                  control={control}
                  name="dueDate"
                  label=""
                  placeholder="Select due date"
                />
                {watch("dueDate") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setValue("dueDate", null)}
                    className="text-gray-400 hover:text-white hover:bg-[#3A404E]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {errors.dueDate && (
                <p className="text-red-400 text-sm mt-1">{errors.dueDate.message}</p>
              )}
            </div>
            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-300">Priority</Label>
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
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 rounded-lg text-white font-semibold hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/30 transition-all duration-300 cursor-pointer"
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  )
}

export default AddEditTaskDialog