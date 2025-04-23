"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "./TaskValidation";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTaskContext } from "./TaskContext";

// Reusable DatePickerWithRange Component
function DatePickerWithRange({
  className,
  value,
  onChange,
}: React.HTMLAttributes<HTMLDivElement> & {
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
              "w-[300px] justify-start text-left font-normal",
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
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const Tasks: React.FC = () => {
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
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);

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
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mb-20" id="tasks">
      <div className="container mx-auto">
        <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16">
          <div className="mb-14 items-center justify-between sm:flex">
            <h2 className="text-2xl font-semibold max-sm:mb-4">Your Tasks</h2>
            <div className="flex items-center space-x-5">
              <div className="relative overflow-hidden rounded-lg text-gray-50 md:min-w-[380px] lg:min-w-[440px]">
                <input
                  type="search"
                  className="z-20 block w-full bg-gray-800 px-4 py-2 pr-10 focus:outline-none"
                  placeholder="Search by description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={openAddDialog}
                className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold cursor-pointer"
              >
                Add Task
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold cursor-pointer">
                    Delete All
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete <strong>all your tasks</strong> permanently.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAllTasks}>
                      Yes, Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <TooltipProvider>
            <table className="table-fixed w-full">
              <thead>
                <tr>
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
                {filteredTasks.map((task, index) => (
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
                        <TooltipContent>
                          <p>{task.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="p-4 truncate max-w-[300px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">{task.description}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{task.description}</p>
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
                          `${format(task.dateRange.from, "LLL dd, y")} - ${format(task.dateRange.to, "LLL dd, y")}`
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
                          className="text-blue-500 cursor-pointer"
                          onClick={() => openEditDialog(index)}
                        >
                          Edit
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-red-500 cursor-pointer">Delete</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This task will be deleted permanently.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteTask(index)}>
                                Yes, Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TooltipProvider>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-[#1D212B] text-white">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
                <DialogDescription>Fill the form below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div>
                  <label className="block mb-1 text-sm">Title</label>
                  <input
                    {...register("title")}
                    className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm">Description</label>
                  <textarea
                    {...register("description")}
                    className="h-[100px] w-full px-3 py-2 rounded-md bg-gray-800 text-white"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm">Tags (comma-separated)</label>
                  <input
                    {...register("tags")}
                    className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-sm">{errors.tags.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-1 text-sm mb-4">Priority</label>
                  <RadioGroup
                    value={watch("priority")}
                    onValueChange={(value) => setValue("priority", value)}
                    className="flex space-x-4"
                  >
                    {["Low", "Medium", "High"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={level.toLowerCase()} />
                        <Label htmlFor={level.toLowerCase()}>{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <label className="block mb-1 text-sm mb-4 mt-6">Date Range</label>
                  <DatePickerWithRange
                    value={watch("dateRange")}
                    onChange={(date) => setValue("dateRange", date)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 px-4 py-2 rounded-md text-white font-semibold"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Tasks;
