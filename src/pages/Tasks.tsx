import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  User, 
  Search,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

export const Tasks = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('board');

  // Mock task data
  const tasks = [
    { 
      id: 1, 
      title: 'Complete project proposal', 
      description: 'Finalize the Q1 marketing campaign proposal for client review',
      status: 'In Progress', 
      priority: 'High',
      dueDate: 'Today',
      project: 'Marketing Campaign',
      assignee: 'John Doe',
      tags: ['proposal', 'client']
    },
    { 
      id: 2, 
      title: 'Review Q3 analytics report', 
      description: 'Analyze performance metrics and prepare summary for leadership',
      status: 'To Do', 
      priority: 'Medium',
      dueDate: 'Tomorrow',
      project: 'Data Analysis',
      assignee: 'Sarah Johnson',
      tags: ['analytics', 'report']
    },
    { 
      id: 3, 
      title: 'Client meeting with Acme Inc.', 
      description: 'Present new service offerings and discuss partnership opportunities',
      status: 'To Do', 
      priority: 'High',
      dueDate: 'Oct 15',
      project: 'Client Relations',
      assignee: 'John Doe',
      tags: ['meeting', 'client']
    },
    { 
      id: 4, 
      title: 'Update website content', 
      description: 'Refresh product pages with new messaging and images',
      status: 'In Progress', 
      priority: 'Low',
      dueDate: 'Oct 18',
      project: 'Website Redesign',
      assignee: 'Emily Chen',
      tags: ['website', 'content']
    },
    { 
      id: 5, 
      title: 'Prepare sales presentation', 
      description: 'Create slides for the upcoming industry conference',
      status: 'To Do', 
      priority: 'Medium',
      dueDate: 'Oct 20',
      project: 'Sales Team Training',
      assignee: 'Michael Brown',
      tags: ['presentation', 'sales']
    },
    { 
      id: 6, 
      title: 'Update CRM with new contacts', 
      description: 'Add leads from the trade show to the database',
      status: 'Done', 
      priority: 'Medium',
      dueDate: 'Oct 10',
      project: 'CRM Management',
      assignee: 'Sarah Johnson',
      tags: ['crm', 'leads']
    },
    { 
      id: 7, 
      title: 'Research competitive landscape', 
      description: 'Analyze competitor offerings and pricing strategies',
      status: 'Done', 
      priority: 'High',
      dueDate: 'Oct 8',
      project: 'Market Research',
      assignee: 'Emily Chen',
      tags: ['research', 'competitive']
    },
  ];

  const statuses = ['To Do', 'In Progress', 'Done'];
  const priorities = ['Low', 'Medium', 'High'];
  const projects = ['All Projects', 'Marketing Campaign', 'Data Analysis', 'Website Redesign', 'Sales Team Training', 'CRM Management', 'Market Research'];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'To Do': return 'border-l-4 border-yellow-500';
      case 'In Progress': return 'border-l-4 border-blue-500';
      case 'Done': return 'border-l-4 border-green-500';
      default: return '';
    }
  };

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {});

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal and team tasks
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Task
          </button>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search tasks"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                Filter
                <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </button>
              
              {filterOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">Project</div>
                    <div className="max-h-48 overflow-y-auto">
                      {projects.map((project) => (
                        <div key={project} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <input
                            id={`project-${project}`}
                            name={`project-${project}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`project-${project}`} className="ml-2 block text-sm text-gray-900">
                            {project}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-t">Priority</div>
                    <div className="max-h-48 overflow-y-auto">
                      {priorities.map((priority) => (
                        <div key={priority} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <input
                            id={`priority-${priority}`}
                            name={`priority-${priority}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`priority-${priority}`} className="ml-2 block text-sm text-gray-900">
                            {priority}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="inline-flex shadow-sm rounded-md">
              <button
                onClick={() => setViewMode('board')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  viewMode === 'board' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-r border-t border-b border-gray-300`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task content */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {statuses.map((status) => (
            <div key={status} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
                  <span>{status}</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                    {tasksByStatus[status].length}
                  </span>
                </h3>
              </div>
              <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[calc(100vh-300px)]">
                {tasksByStatus[status].map((task) => (
                  <li key={task.id} className={`p-4 hover:bg-gray-50 ${getStatusColor(task.status)}`}>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">{task.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">{task.project}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="mr-1 h-3 w-3" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-xs">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                          {task.assignee.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-2 flex flex-wrap">
                        {task.tags.map((tag) => (
                          <span key={tag} className="mr-1 mb-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className={`hover:bg-gray-50 ${getStatusColor(task.status)}`}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <CheckSquare className={
                          task.status === 'Done' 
                            ? 'h-5 w-5 text-green-500' 
                            : 'h-5 w-5 text-gray-400'
                        } />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <span 
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {task.assignee}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <CheckSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {task.project}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>Due {task.dueDate}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap">
                    {task.tags.map((tag) => (
                      <span key={tag} className="mr-1 mb-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};