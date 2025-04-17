"use client";
import React, { useState } from 'react';

interface Task {
  title: string;
  description: string;
  tags: string[];
  tagColors: string[];
  priority: string;
  starred: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      title: 'Integration API',
      description: 'Connect an existing API to a third-party database using secure methods and handle data exchange efficiently.',
      tags: ['Web', 'Python', 'API'],
      tagColors: ['bg-[#00D991A1]', 'bg-[#1C92FFB0]', 'bg-[#FE1A1AB5]'],
      priority: 'High',
      starred: true,
    },
    {
      title: 'API Data Synchronization with Python',
      description: 'Implement a Python solution to synchronize data between an API and a third-party database securely, optimizing data exchange.',
      tags: ['Python', 'API', 'Data Synchronization'],
      tagColors: ['bg-[#00D991A1]', 'bg-[#FE1A1AB5]', 'bg-[#BD560BB2]'],
      priority: 'High',
      starred: false,
    },
    {
      title: 'Efficient Web API Connectivity in Python',
      description: 'Develop a Python-based solution for connecting an API to a third-party database securely, focusing on efficient data handling and exchange.',
      tags: ['Web', 'Python', 'API'],
      tagColors: ['bg-[#00B2D9CC]', 'bg-[#8407E6A8]', 'bg-[#07AC67D6]'],
      priority: 'High',
      starred: false,
    },
    {
      title: 'Data Handling',
      description: 'Integrate a web API with a third-party database using secure methods, focusing on seamless data exchange and data integrity.',
      tags: ['Web', 'Python', 'Security'],
      tagColors: ['bg-[#2F43F8BF]', 'bg-[#AE6D0BDB]', 'bg-[#10FBEDB2]'],
      priority: 'High',
      starred: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleAddTask = () => {
    const newTask: Task = {
      title: 'New Task',
      description: 'this is new task i added.',
      tags: ['New', 'React'],
      tagColors: ['bg-green-500', 'bg-blue-500'],
      priority: 'Medium',
      starred: false,
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteAll = () => {
    setTasks([]);
  };

  const handleDeleteTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleEditTask = (index: number) => {
    const taskToEdit = tasks[index];
    const newTitle = prompt("Edit Task Title:", taskToEdit.title);
    const newDescription = prompt("Edit Task Description:", taskToEdit.description);

    if (newTitle !== null && newDescription !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[index] = {
        ...taskToEdit,
        title: newTitle,
        description: newDescription,
      };
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStar = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].starred = !updatedTasks[index].starred;
    setTasks(updatedTasks);
  };
  
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
                      onChange={(e) =>setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-2 top-0 h-full flex items-center pr-2 text-white md:right-4">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold cursor-pointer"
                onClick={handleAddTask}
              >
                Add Task
              </button>
              <button
                className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold cursor-pointer"
                onClick={handleDeleteAll}
              >
                Delete All
              </button>
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
                  <tr key={index} className="border-b border-[#2E3443] [&>td]:align-baseline [&>td]:px-4 [&>td]:py-2">
                    <td>
                    <svg
                      onClick={() => handleToggleStar(index)}
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-star cursor-pointer transition-all duration-200"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke={task.starred ? 'white' : 'currentColor'}
                      fill={task.starred ? 'white' : 'none'}
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
                            <span className={`inline-block h-5 whitespace-nowrap rounded-[45px] px-2.5 text-sm capitalize text-[#F4F5F6] ${task.tagColors[i]}`}>
                              {tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-center">{task.priority}</td>
                    <td>
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-red-500 cursor-pointer" onClick={() => handleDeleteTask(index)}>
                          Delete
                        </button>
                        <button className="text-blue-500 cursor-pointer" onClick={() => handleEditTask(index)}>
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
