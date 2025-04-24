"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "./TaskValidation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addDays, format } from "date-fns";
import { CalendarIcon, Trash2, FilePenLine, Eye } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTaskContext } from "./TaskContext";

// date-picker
function DatePickerWithRange({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: DateRange | undefined;
  onChange?: (date: DateRange | undefined) => void;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  );

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };
  return (
    <div className={cn("grid gap-2", className)}>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[300px]justify-start text-left font-normal bg-[#2D333F] text-white border border-transparent hover:bg-gray-700 hover:text-color-700 transition-colors duration-300",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#2D333F] border-gray-600" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          className="bg-[#2D333F] text-white"
        />
      </PopoverContent>
    </Popover>
  </div>
  );
}

const Tasks = () => {
  const {
    tasks,
    searchTerm,
    setSearchTerm,
    addTask,
    deleteTask,
    deleteAllTasks,
    editTask,
    toggleStar,
  } = useTaskContext();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [viewingIndex, setViewingIndex] = React.useState<number | null>(null);
  const [priorityFilter, setPriorityFilter] = React.useState("All");

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
      dateRange: { from: new Date(), to: addDays(new Date(), 7) },
    },
  });

  const openEditDialog = (index: number) => {
    const task = tasks[index];
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("tags", task.tags.join(","));
    setValue("priority", task.priority);
    setValue("dateRange", task.dateRange);
    setIsEditing(true);
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const openViewDialog = (index: number) => {
    setViewingIndex(index);
    setViewDialogOpen(true);
  };

  const openAddDialog = () => {
    reset();
    setIsEditing(false);
    setEditingIndex(null);
    setDialogOpen(true);
  };

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
        formattedData.priority,
        formattedData.dateRange
      );
    } else {
      addTask(formattedData);
    }

    setDialogOpen(false);
    reset();
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (priorityFilter === "All" || task.priority === priorityFilter)
  );

  return (
    <section className="mb-20" id="tasks">
      <div className="container mx-auto">
        <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16">
          <div className="mb-14 items-center justify-between sm:flex">
            <h2 className="text-2xl font-semibold text-white max-sm:mb-4">Your Tasks</h2>
            <div className="flex items-center space-x-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-[#2D333F] text-white border-gray-600 hover:bg-gray-700"
                  >
                    Filter by Priority: {priorityFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#2D333F] text-white border-gray-600">
                  <DropdownMenuLabel>Priority Filter</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  {["All", "Low", "Medium", "High"].map((priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() => setPriorityFilter(priority)}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {priority}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative overflow-hidden rounded-lg text-gray-50 md:min-w-[380px] lg:min-w-[440px]">
                <input
                  type="search"
                  className="z-20 block w-full bg-[#2D333F] px-4 py-2.5 pr-10 text-white border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 outline-none transition-all duration-200"
                  placeholder="Search by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={openAddDialog}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer"
              >
                Add Task
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 cursor-pointer">
                    Delete All
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#2D333F] text-white border-gray-600">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      This action will delete <strong>all your tasks</strong> permanently.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteAllTasks}
                      className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      Yes, Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <TooltipProvider>
            <table className="table-fixed w-full text-white">
              <thead>
                <tr className="border-b border-[#2E3443]">
                  <th className="p-4">★</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Tags</th>
                  <th className="p-4 text-center">Priority</th>
                  <th className="p-4 text-center">Date Range</th>
                  <th className="p-4 text-center">Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-300 text-lg">
                      No task will show here
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, index) => (
                    <tr key={index} className="border-b border-[#2E3443]">
                      <td className="text-center">
                        <svg
                          onClick={() => toggleStar(index)}
                          xmlns="http://www.w3.org/2000/svg"
                          className="cursor-pointer"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke={task.starred ? "yellow" : "currentColor"}
                          fill={task.starred ? "yellow" : "none"}
                        >
                          <path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1L12 2l3.086 6.255l6.9 1l-5 4.867l1.179 6.873z" />
                        </svg>
                      </td>
                      <td className="p-4 truncate max-w-[100px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">{task.title}</span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#2D333F] text-white border-gray-600">
                            <p>{task.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="p-4 truncate max-w-[300px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">{task.description}</span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#2D333F] text-white border-gray-600">
                          <p className="" style={{ width: '400px' }}>{task.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td>
                        <ul className="flex flex-wrap gap-1.5">
                          {task.tags.map((tag, i) => (
                            <li key={i}>
                              <span className="inline-block rounded px-2 py-0.5 text-sm bg-blue-700 text-white">
                                {tag}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="text-center">{task.priority}</td>
                      <td className="text-center">
                        {task.dateRange?.from ? (
                          task.dateRange.to ? (
                            `${format(task.dateRange.from, "10 dd, y")} - ${format(task.dateRange.to, "LLL dd, y")}`
                          ) : (
                            format(task.dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          "No date"
                        )}
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            className="text-blue-500 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                            onClick={() => openViewDialog(index)}
                          >
                            <Eye />
                          </button>
                          <button
                            className="text-blue-500 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                            onClick={() => openEditDialog(index)}
                          >
                            <FilePenLine />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="text-red-500 hover:text-red-400 transition-colors duration-200 cursor-pointer">
                                <Trash2 />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#2D333F] text-white border-gray-600">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-300">
                                  This task will be deleted permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 cursor-pointer">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteTask(index)}
                                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                >
                                  Yes, Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </TooltipProvider>

          {/* Edit/Add Task Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-gradient-to-br from-[#1D212B] to-[#2A2F3B] text-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-700/50">
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
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">Date Range</label>
                  <DatePickerWithRange
                    value={watch("dateRange")}
                    onChange={(date) => setValue("dateRange", date)}
                    className="w-full bg-[#2D333F] text-white border border-gray-600 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                  />
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

          {/* View Task Details Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="text-center bg-gradient-to-br from-[#1D212B] to-[#2A2F3B] text-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-gray-700/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-white text-center">
                  Task Details
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-300 text-center">
                  Review the task details below.
                </DialogDescription>
              </DialogHeader>
              {viewingIndex !== null && tasks[viewingIndex] && (
                <div className="space-y-6 mt-6">
                  <div>
                    <p className="w-full py-2.5 rounded-lg text-white">
                      {tasks[viewingIndex].title}
                    </p>
                  </div>
                  <div>
                    <p className="w-full py-2.5 rounded-lg text-white">
                      {tasks[viewingIndex].description}
                    </p>
                  </div>
                  <div>
                    <p className="w-full py-2.5 rounded-lg bg-gray-700 text-white">
                      {tasks[viewingIndex].tags.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "px-4 py-2 rounded-lg text-white",
                        tasks[viewingIndex].priority === "Low" && "bg-gray-700",
                        tasks[viewingIndex].priority === "Medium" && "bg-yellow-600",
                        tasks[viewingIndex].priority === "High" && "bg-green-600"
                      )}
                    >
                      {tasks[viewingIndex].priority}
                    </span>
                  </div>
                  <div>
                    {/* <label className="block mb-2 text-sm font-medium text-gray-300">Date Range</label>
                    <div className="flex items-center space-x-3">
                      <p className="flex-1 px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600">
                        {tasks[viewingIndex].dateRange?.from
                          ? format(tasks[viewingIndex].dateRange.from, "LLL dd, y")
                          : "No start date"}
                      </p>
                      <span className="text-gray-300">to</span>
                      <p className="flex-1 px-4 py-2.5 rounded-lg bg-[#2D333F] text-white border border-gray-600">
                        {tasks[viewingIndex].dateRange?.to
                          ? format(tasks[viewingIndex].dateRange.to, "LLL dd, y")
                          : "No end date"}
                      </p>
                    </div> */}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Tasks;