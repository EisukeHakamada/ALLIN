import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  MoreVertical, 
  ChevronDown,
  Users,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

export const Projects = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('board');

  // Mock project data
  const projects = [
    { 
      id: 1, 
      name: 'Marketing Campaign 2025', 
      description: 'Q1 digital marketing campaign for new product launch',
      status: 'In Progress', 
      progress: 65, 
      dueDate: 'Nov 15, 2025',
      team: ['John D.', 'Sara L.', 'Mike T.'],
      priority: 'High',
      kpis: [
        { name: 'Lead Generation', target: '500', current: '325', status: 'on-track' },
        { name: 'Conversion Rate', target: '15%', current: '12%', status: 'on-track' }
      ]
    },
    { 
      id: 2, 
      name: 'Website Redesign', 
      description: 'Complete overhaul of company website with new brand guidelines',
      status: 'In Progress', 
      progress: 32, 
      dueDate: 'Dec 20, 2025',
      team: ['Alex R.', 'Emma P.'],
      priority: 'Medium',
      kpis: [
        { name: 'Page Load Time', target: '< 2s', current: '2.4s', status: 'at-risk' },
        { name: 'Mobile Responsiveness', target: '100%', current: '85%', status: 'on-track' }
      ]
    },
    { 
      id: 3, 
      name: 'Product Launch', 
      description: 'Preparation and execution of the new product line launch',
      status: 'Planning', 
      progress: 15, 
      dueDate: 'Jan 30, 2026',
      team: ['John D.', 'Lisa M.', 'Robert K.', 'Anna S.'],
      priority: 'High',
      kpis: [
        { name: 'Pre-orders', target: '1000', current: '250', status: 'at-risk' },
        { name: 'Press Coverage', target: '20 articles', current: '5 articles', status: 'on-track' }
      ]
    },
    { 
      id: 4, 
      name: 'Customer Feedback Analysis', 
      description: 'Analyzing customer survey results and implementing improvements',
      status: 'Completed', 
      progress: 100, 
      dueDate: 'Sep 30, 2025',
      team: ['Sara L.', 'David W.'],
      priority: 'Low',
      kpis: [
        { name: 'Survey Responses', target: '500', current: '650', status: 'completed' },
        { name: 'Actionable Insights', target: '10', current: '12', status: 'completed' }
      ]
    },
    { 
      id: 5, 
      name: 'Sales Team Training', 
      description: 'Training program for the sales team on new CRM system',
      status: 'At Risk', 
      progress: 45, 
      dueDate: 'Oct 15, 2025',
      team: ['Mike T.', 'Emma P.', 'Robert K.'],
      priority: 'High',
      kpis: [
        { name: 'Training Completion', target: '100%', current: '45%', status: 'at-risk' },
        { name: 'Proficiency Score', target: '85%', current: '72%', status: 'at-risk' }
      ]
    },
  ];

  const statuses = ['All', 'Planning', 'In Progress', 'At Risk', 'On Hold', 'Completed'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKpiStatusColor = (status) => {
    switch(status) {
      case 'on-track': return 'text-green-600';
      case 'at-risk': return 'text-yellow-600';
      case 'off-track': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getKpiStatusIcon = (status) => {
    switch(status) {
      case 'on-track': return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case 'at-risk': return <Clock className="h-4 w-4 mr-1" />;
      case 'off-track': return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your projects in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Project
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
                placeholder="Search projects"
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
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">Status</div>
                    <div className="max-h-48 overflow-y-auto">
                      {statuses.map((status) => (
                        <div key={status} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <input
                            id={`status-${status}`}
                            name={`status-${status}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`status-${status}`} className="ml-2 block text-sm text-gray-900">
                            {status}
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

      {/* Project list */}
      {viewMode === 'list' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{project.name}</p>
                      <span 
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}
                      >
                        {project.status}
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
                        <Tag className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}
                        >
                          {project.priority} Priority
                        </span>
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {project.team.length} team members
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>Due {project.dueDate}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Progress</span>
                      <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          project.status === 'At Risk' 
                            ? 'bg-red-500' 
                            : project.status === 'Completed'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">{project.name}</h3>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        project.status === 'At Risk' 
                          ? 'bg-red-500' 
                          : project.status === 'Completed'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Tag className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <span 
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}
                    >
                      {project.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <p className="text-gray-500">{project.dueDate}</p>
                  </div>
                </div>
                
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500">Team</h4>
                  <div className="mt-2 flex -space-x-1 overflow-hidden">
                    {project.team.map((member, idx) => (
                      <div 
                        key={idx}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 border-2 border-white"
                      >
                        <span className="text-xs font-medium text-gray-700">
                          {member.split(' ')[0][0]}{member.split(' ')[1][0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">KPIs</h4>
                  <div className="space-y-2">
                    {project.kpis.map((kpi, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{kpi.name}</span>
                        <div className="flex items-center">
                          <span className="mr-2">{kpi.current} / {kpi.target}</span>
                          <span className={`flex items-center ${getKpiStatusColor(kpi.status)}`}>
                            {getKpiStatusIcon(kpi.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};