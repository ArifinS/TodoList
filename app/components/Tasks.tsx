"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "./TaskValidation";
import { Trash2, FilePenLine, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskDetailsDialog from "./TaskDetailsDialog";
import AddEditTaskDialog from "./AddEditTaskDialog";
import Gropingdropdown from "./Gropingdropdown";
import SearchStream from "./Searchtream";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTaskContext } from "./TaskContext";

const notify = (message: string, type: "success" | "error" = "success") => {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
    default:
      toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  }
};

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
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [viewingTaskId, setViewingTaskId] = React.useState<string | null>(null);
  const [groupBy, setGroupBy] = React.useState<string>("None");

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

  const getTaskById = (id: string) => {
    return tasks?.find((task) => task.id === id) || null;
  };

  const openEditDialog = (id: string) => {
    const task = getTaskById(id);
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("tags", task.tags.join(","));
      setValue("priority", task.priority);
      setIsEditing(true);
      setEditingTaskId(id);
      setDialogOpen(true);
    }
  };

  const openViewDialog = (id: string) => {
    setViewingTaskId(id);
    setViewDialogOpen(true);
  };

  const openAddDialog = () => {
    reset();
    setIsEditing(false);
    setEditingTaskId(null);
    setDialogOpen(true);
  };

  const onSubmit = (data: TaskFormData) => {
    const formattedData = {
      ...data,
      tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    if (isEditing && editingTaskId !== null) {
      editTask(
        editingTaskId,
        formattedData.title,
        formattedData.description,
        formattedData.tags,
        formattedData.priority
      );
      notify("Task updated successfully!", "success");
    } else {
      addTask(formattedData);
      notify("Task added successfully!", "success");
    }

    setDialogOpen(false);
    reset();
  };

  const filteredTasks = tasks?.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const groupedTasks = React.useMemo(() => {
    const groups: { [key: string]: typeof tasks } = {};

    if (groupBy === "None") {
      groups["All Tasks"] = filteredTasks;
    } else if (groupBy === "Priority") {
      ["Low", "Medium", "High"].forEach((priority) => {
        groups[priority] = filteredTasks.filter((task) => task.priority === priority);
      });
    } else if (groupBy === "Favorites") {
      groups["Starred"] = filteredTasks.filter((task) => task.starred);
      groups["Not Starred"] = filteredTasks.filter((task) => !task.starred);
    } else if (groupBy === "Tags") {
      const allTags = new Set(filteredTasks.flatMap((task) => task.tags));
      allTags.forEach((tag) => {
        groups[tag] = filteredTasks.filter((task) => task.tags.includes(tag));
      });
      if (Object.keys(groups).length === 0) {
        groups["No Tags"] = filteredTasks.filter((task) => task.tags.length === 0);
      }
    }

    return groups;
  }, [filteredTasks, groupBy]);

  if (!tasks) {
    return (
      <div className="text-center py-8 text-gray-300 text-lg">
        No tasks to display
      </div>
    );
  }

  return (
    <section className="mb-20" id="tasks">
      <div className="container mx-auto">
        <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16">
          <div className="mb-14 items-center justify-between sm:flex">
            <h2 className="text-2xl font-semibold text-white max-sm:mb-4">Your Tasks</h2>
            <div className="flex items-center space-x-5">
              <Gropingdropdown groupBy={groupBy} setGroupBy={setGroupBy} />
              <SearchStream searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <button
                onClick={openAddDialog}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer"
              >
                Add Task
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    disabled={tasks.length === 0}
                    className={`rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 ${
                      tasks.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    Delete All
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#2D333F] text-white border-gray-600">
                  {tasks.length === 0 ? (
                    <>
                      <AlertDialogHeader>
                        <AlertDialogTitle>No Tasks Available</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          There are currently no tasks to delete. Add some tasks to get started.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 cursor-pointer">
                          Close
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </>
                  ) : (
                    <>
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
                          onClick={() => {
                            notify("All tasks deleted", "error");
                            deleteAllTasks();
                          }}
                          className="bg-red-600 hover:bg-red-700 cursor-pointer"
                        >
                          Yes, Delete All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <TooltipProvider>
            {Object.keys(groupedTasks).length === 0 || filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-300 text-lg">
                No tasks to display
              </div>
            ) : (
              Object.entries(groupedTasks).map(([group, groupTasks]) =>
                groupTasks.length > 0 ? (
                  <div key={group} className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {groupBy === "Favorites"
                        ? group
                        : groupBy === "Priority"
                        ? `Priority: ${group}`
                        : groupBy === "Tags"
                        ? `Tag: ${group}`
                        : ""}
                    </h3>
                    <table className="table-fixed w-full text-white">
                      <thead>
                        <tr className="border-b border-[#2E3443]">
                          {groupBy !== "Favorites" && (
                            <th className="p-4">★</th>
                          )}
                          <th className="p-4 text-left">Title</th>
                          <th className="p-4 text-left">Description</th>
                          {groupBy !== "Tags" && (
                            <th className="p-4 text-left">Tags</th>
                          )}
                          {groupBy !== "Priority" && (
                            <th className="p-4 text-center">Priority</th>
                          )}
                          <th className="p-4 text-center">Options</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupTasks.map((task) => (
                          <tr key={task.id} className="border-b border-[#2E3443]">
                            {groupBy !== "Favorites" && (
                              <td className="text-center">
                                <svg
                                  onClick={() => toggleStar(task.id)}
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
                            )}
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
                                  <p style={{ width: "400px" }}>{task.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </td>
                            {groupBy !== "Tags" && (
                              <td>
                                <ul className="flex flex-wrap gap-1.5">
                                  {task.tags.map((tag, i) => (
                                    <li key={i}>
                                      <span
                                        className={`inline-block rounded px-2 py-0.5 text-sm text-white ${task.tagColors[i]}`}
                                      >
                                        {tag}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            )}
                            {groupBy !== "Priority" && (
                              <td className="text-center">{task.priority}</td>
                            )}
                            <td className="text-center">
                              <div className="flex justify-center gap-3">
                                <button
                                  className="text-blue-500 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                                  onClick={() => openViewDialog(task.id)}
                                >
                                  <Eye />
                                </button>
                                <button
                                  className="text-blue-500 hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                                  onClick={() => openEditDialog(task.id)}
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
                                        onClick={() => {
                                          notify("Task deleted!", "error");
                                          deleteTask(task.id);
                                        }}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null
              )
            )}
          </TooltipProvider>

          <TaskDetailsDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            task={viewingTaskId !== null ? getTaskById(viewingTaskId) || null : null}
          />

          <AddEditTaskDialog
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            isEditing={isEditing}
            editingTaskId={editingTaskId}
            tasks={tasks}
            editTask={editTask}
            addTask={addTask}
          />
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Tasks;