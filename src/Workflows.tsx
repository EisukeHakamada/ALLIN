import React, { useState } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  GitBranch, 
  Mail, 
  MessageSquare, 
  Bell, 
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
  Calendar,
  FileText,
  Search
} from 'lucide-react';

export const Workflows = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  
  // Mock workflow data
  const workflows = [
    {
      id: 1,
      name: 'Lead Nurturing',
      description: 'Automatically follow up with leads who have shown interest',
      status: 'Active',
      lastRun: '2 hours ago',
      runsThisMonth: 45,
      createdBy: 'John Doe',
      createdAt: 'Aug 15, 2025',
      triggers: ['New Lead Created', 'Form Submission'],
      actions: ['Send Email', 'Create Task', 'Update CRM'],
      conditions: ['Lead Score > 50', 'Industry = Technology']
    },
    {
      id: 2,
      name: 'Project Status Update',
      description: 'Send weekly status updates to project stakeholders',
      status: 'Active',
      lastRun: '1 day ago',
      runsThisMonth: 12,
      createdBy: 'Sarah Johnson',
      createdAt: 'Sep 5, 2025',
      triggers: ['Schedule (Weekly)', 'Project Status Change'],
      actions: ['Generate Report', 'Send Email', 'Create Calendar Event'],
      conditions: ['Project Status != Completed', 'Has Stakeholders']
    },
    {
      id: 3,
      name: 'Customer Onboarding',
      description: 'Guide new customers through the onboarding process',
      status: 'Inactive',
      lastRun: 'Never',
      runsThisMonth: 0,
      createdBy: 'Mike Brown',
      createdAt: 'Sep 20, 2025',
      triggers: ['New Customer Created'],
      actions: ['Send Welcome Email', 'Create Tasks', 'Schedule Call'],
      conditions: ['Customer Type = New']
    },
    {
      id: 4,
      name: 'Invoice Reminder',
      description: 'Send reminders for upcoming and overdue invoices',
      status: 'Active',
      lastRun: '12 hours ago',
      runsThisMonth: 32,
      createdBy: 'John Doe',
      createdAt: 'Aug 30, 2025',
      triggers: ['Invoice Due Date (5 days before)', 'Invoice Overdue'],
      actions: ['Send Email', 'Create Notification', 'Update Invoice Status'],
      conditions: ['Invoice Status != Paid', 'Invoice Amount > 0']
    },
  ];

  // Mock workflow logs
  const workflowLogs = [
    { id: 1, workflow: 'Lead Nurturing', timestamp: '2025-10-14 09:45:23', status: 'Success', message: 'Workflow executed successfully', details: 'Email sent to john@example.com' },
    { id: 2, workflow: 'Project Status Update', timestamp: '2025-10-14 08:30:11', status: 'Success', message: 'Workflow executed successfully', details: 'Status report generated and sent to 5 stakeholders' },
    { id: 3, workflow: 'Lead Nurturing', timestamp: '2025-10-13 15:22:47', status: 'Warning', message: 'Workflow completed with warnings', details: 'Could not create task: Insufficient permissions' },
    { id: 4, workflow: 'Invoice Reminder', timestamp: '2025-10-13 12:10:05', status: 'Success', message: 'Workflow executed successfully', details: 'Reminder sent for invoice #INV-2025-104' },
    { id: 5, workflow: 'Lead Nurturing', timestamp: '2025-10-12 17:05:33', status: 'Error', message: 'Workflow execution failed', details: 'Email service unavailable' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogStatusIcon = (status) => {
    switch(status) {
      case 'Success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTriggerIcon = (trigger) => {
    if (trigger.includes('Lead')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (trigger.includes('Form')) return <FileText className="h-5 w-5 text-purple-500" />;
    if (trigger.includes('Schedule')) return <Calendar className="h-5 w-5 text-green-500" />;
    if (trigger.includes('Project')) return <FileText className="h-5 w-5 text-amber-500" />;
    if (trigger.includes('Customer')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (trigger.includes('Invoice')) return <FileText className="h-5 w-5 text-red-500" />;
    return <Info className="h-5 w-5 text-gray-400" />;
  };

  const getActionIcon = (action) => {
    if (action.includes('Email')) return <Mail className="h-5 w-5 text-blue-500" />;
    if (action.includes('Task')) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (action.includes('CRM')) return <FileText className="h-5 w-5 text-purple-500" />;
    if (action.includes('Report')) return <FileText className="h-5 w-5 text-amber-500" />;
    if (action.includes('Calendar')) return <Calendar className="h-5 w-5 text-blue-500" />;
    if (action.includes('Notification')) return <Bell className="h-5 w-5 text-red-500" />;
    if (action.includes('Call')) return <MessageSquare className="h-5 w-5 text-green-500" />;
    return <Info className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage automated workflows
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create Workflow
          </button>
        </div>
      </div>

      {/* Search section */}
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
                placeholder="Search workflows"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workflow list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {workflows.map((workflow) => (
            <li key={workflow.id}>
              <div 
                className={`block hover:bg-gray-50 cursor-pointer ${selectedWorkflow === workflow.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedWorkflow(workflow.id === selectedWorkflow ? null : workflow.id)}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <GitBranch className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">{workflow.name}</p>
                        <p className="text-sm text-gray-500">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}
                      >
                        {workflow.status}
                      </span>
                      <div className="ml-2 flex-shrink-0 flex">
                        {workflow.status === 'Active' ? (
                          <button 
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                            title="Pause workflow"
                          >
                            <Pause className="h-5 w-5" />
                          </button>
                        ) : (
                          <button 
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                            title="Activate workflow"
                          >
                            <Play className="h-5 w-5" />
                          </button>
                        )}
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          title="Edit workflow"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          title="Delete workflow"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Last run: {workflow.lastRun}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Play className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {workflow.runsThisMonth} runs this month
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>Created on {workflow.createdAt}</p>
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {selectedWorkflow === workflow.id && (
                  <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Triggers</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="space-y-2">
                            {workflow.triggers.map((trigger, idx) => (
                              <li key={idx} className="flex items-center">
                                {getTriggerIcon(trigger)}
                                <span className="ml-2">{trigger}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Actions</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="space-y-2">
                            {workflow.actions.map((action, idx) => (
                              <li key={idx} className="flex items-center">
                                {getActionIcon(action)}
                                <span className="ml-2">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Conditions</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <ul className="space-y-1">
                            {workflow.conditions.map((condition, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View full details
                        </button>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Workflow logs */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Execution Logs</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {workflowLogs.map((log) => (
              <li key={log.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getLogStatusIcon(log.status)}
                        <p className="ml-3 text-sm font-medium text-gray-900">{log.workflow}</p>
                        <span 
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'Success' ? 'bg-green-100 text-green-800' :
                            log.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                        <p>{log.message}</p>
                        <p className="mt-1 text-xs">{log.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> results
                </p>
              </div>
              <div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all logs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};