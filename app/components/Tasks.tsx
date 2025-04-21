"use client";
import React from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTaskContext } from "./TaskContext";

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

  const [newTaskData, setNewTaskData] = React.useState({
    title: "",
    description: "",
    tags: "",
  });

  const handleAddTask = () => {
    addTask(newTaskData);
    setNewTaskData({ title: "", description: "", tags: "" });
  };

  const handleEditTask = (index: number) => {
    const taskToEdit = tasks[index];
    const newTitle = prompt("Edit Task Title:", taskToEdit.title);
    const newDescription = prompt("Edit Task Description:", taskToEdit.description);

    if (newTitle !== null && newDescription !== null) {
      editTask(index, newTitle, newDescription);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mb-20" id="tasks">
      <div className="container mx-auto">
        <div className="rounded-xl border border-[rgba(206,206,206,0.12)] bg-[#1D212B] px-6 py-8 md:px-9 md:py-16">
          <div className="mb-14 items-center justify-between sm:flex">
            <h2 className="text-2xl font-semibold max-sm:mb-4">Your Tasks</h2>
            <div className="flex items-center space-x-5">
              <div>
                <div className="flex">
                  <div className="relative overflow-hidden rounded-lg text-gray-50 md:min-w-[380px] lg:min-w-[440px]">
                    <input
                      type="search"
                      id="search-dropdown"
                      className="z-20 block w-full bg-gray-800 px-4 py-2 pr-10 focus:outline-none"
                      placeholder="Search by description"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-2 top-0 h-full flex items-center pr-2 text-white md:right-4">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold cursor-pointer">
                    Add Task
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1D212B] text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Enter your new task details below.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block mb-1 text-sm">Title</label>
                      <input
                        type="text"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Description</label>
                      <textarea
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={newTaskData.tags}
                        onChange={(e) => setNewTaskData({ ...newTaskData, tags: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleAddTask}
                      className="bg-green-600 px-4 py-2 rounded-md cursor-pointer text-white"
                    >
                      Confirm Add Task
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
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
                      This action will delete <strong>all your tasks</strong> permanently. You won’t be able to recover them.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAllTasks}>Yes, Delete All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="table-fixed overflow-auto xl:w-full">
              <thead>
                <tr>
                  <th className="p-4 pb-8 text-sm font-semibold capitalize w-[48px]"></th>
                  <th className="p-4 pb-8 text-sm font-semibold capitalize w-[300px]">Title</th>
                  <th className="p-4 pb-8 text-sm font-semibold capitalize w-full">Description</th>
                  <th className="p-4 pb-8 text-sm font-semibold capitalize md:w-[350px]">Tags</th>
                  <th className="p-4 pb-8 text-sm font-semibold capitalize md:w-[100px]">Priority</th>
                  <th className="p-4 pb-8 text-sm font-semibold capitalize md:w-[100px]">Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#2E3443] [&>td]:align-baseline [&>td]:px-4 [&>td]:py-2"
                  >
                    <td>
                      <svg
                        onClick={() => toggleStar(index)}
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-star cursor-pointer transition-all duration-200"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke={task.starred ? "yellow" : "currentColor"}
                        fill={task.starred ? "yellow" : "none"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                      </svg>
                    </td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <ul className="flex justify-center gap-1.5 flex-wrap">
                        {task.tags.map((tag, i) => (
                          <li key={i}>
                            <span
                              className={`inline-block h-5 whitespace-nowrap rounded-[45px] px-2.5 text-sm capitalize text-[#F4F5F6] ${task.tagColors[i]}`}
                            >
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-center">{task.priority}</td>
                    <td>
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteTask(index)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleEditTask(index)}
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tasks;