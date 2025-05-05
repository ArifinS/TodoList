"use client"

import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { taskSchema } from "./TaskValidation"
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
import "react-toastify/dist/ReactToastify.css"
import { DatePickerForm } from "./DatePicker"
import { Form } from "@/components/ui/form"

// Infer the form data type from the schema
type TaskFormData = z.infer<typeof taskSchema>;

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
  addTask: (data: any) => void
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
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      priority: "Medium",
      dueDate: null,
    },
  })
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = form

  useEffect(() => {
    if (isEditing && editingTaskId) {
      const currentTask = tasks.find((task) => task.id === editingTaskId)
      if (currentTask) {
        setValue("title", currentTask.title)
        setValue("description", currentTask.description)
        setValue("tags", currentTask.tags.join(","))
        setValue("priority", currentTask.priority as "Low" | "Medium" | "High")
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
    console.log("formData<<", data)
    try {
      const formattedData = {
        ...data,
        tags: data.tags
          ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <div>
                <Label className="block mb-1 text-sm font-medium text-gray-300">Title</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all duration-200 placeholder-gray-500"
                      placeholder="Enter task title"
                    />
                  )}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label className="block mb-1 text-sm font-medium text-gray-300">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full h-28 px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none resize-none transition-all duration-200 placeholder-gray-500"
                      placeholder="Enter task description"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
              <div>
                <Label className="block mb-1 text-sm font-medium text-gray-300">Tags (comma-separated)</Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all duration-200 placeholder-gray-500"
                      placeholder="e.g., work, urgent"
                    />
                  )}
                />
                {errors.tags && (
                  <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>
                )}
              </div>
              <div>
                <Label className="block mb-1 text-sm font-medium text-gray-300">Due Date</Label>
                <div className="flex items-center gap-2">
                  <DatePickerForm
                    name="dueDate"
                    label=""
                    placeholder="Select due date"
                    control={control}
                  />
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
                {errors.priority && (
                  <p className="text-red-400 text-sm mt-1">{errors.priority.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 rounded-lg text-white font-semibold hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-500/30 transition-all duration-300 cursor-pointer"
              >
                {isEditing ? "Update Task" : "Add Task"}
              </button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ToastContainer theme="dark" position="bottom-right" />
    </>
  )
}

export default AddEditTaskDialog