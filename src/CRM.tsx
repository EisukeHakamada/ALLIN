import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Mail, 
  Phone, 
  Calendar, 
  MoreVertical,
  Users,
  UserPlus,
  BarChart3,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const CRM = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('customers');
  
  // Mock customer data
  const customers = [
    {
      id: 1,
      name: 'Acme Corporation',
      contact: 'John Smith',
      email: 'john@acmecorp.com',
      phone: '(555) 123-4567',
      status: 'Active',
      industry: 'Technology',
      lastContact: '2 days ago',
      value: '$15,000',
      changePercent: 12,
    },
    {
      id: 2,
      name: 'Globex Industries',
      contact: 'Sarah Johnson',
      email: 'sarah@globex.com',
      phone: '(555) 234-5678',
      status: 'Lead',
      industry: 'Manufacturing',
      lastContact: '1 week ago',
      value: '$8,500',
      changePercent: -5,
    },
    {
      id: 3,
      name: 'Stark Enterprises',
      contact: 'Tony Parker',
      email: 'tony@stark.com',
      phone: '(555) 345-6789',
      status: 'Active',
      industry: 'Technology',
      lastContact: '1 day ago',
      value: '$25,000',
      changePercent: 20,
    },
    {
      id: 4,
      name: 'Wayne Industries',
      contact: 'Bruce Williams',
      email: 'bruce@wayne.com',
      phone: '(555) 456-7890',
      status: 'Inactive',
      industry: 'Finance',
      lastContact: '3 weeks ago',
      value: '$12,300',
      changePercent: -8,
    },
    {
      id: 5,
      name: 'Oscorp LLC',
      contact: 'Norman Green',
      email: 'norman@oscorp.com',
      phone: '(555) 567-8901',
      status: 'Lead',
      industry: 'Healthcare',
      lastContact: '5 days ago',
      value: '$7,800',
      changePercent: 3,
    },
  ];

  // Mock opportunities data
  const opportunities = [
    {
      id: 1,
      name: 'Enterprise software license',
      customer: 'Acme Corporation',
      value: '$50,000',
      stage: 'Proposal',
      probability: 70,
      expectedCloseDate: 'Nov 15, 2025',
      owner: 'John Doe',
    },
    {
      id: 2,
      name: 'Manufacturing equipment',
      customer: 'Globex Industries',
      value: '$125,000',
      stage: 'Negotiation',
      probability: 60,
      expectedCloseDate: 'Dec 10, 2025',
      owner: 'Sarah Johnson',
    },
    {
      id: 3,
      name: 'IT services contract',
      customer: 'Stark Enterprises',
      value: '$75,000',
      stage: 'Discovery',
      probability: 40,
      expectedCloseDate: 'Jan 20, 2026',
      owner: 'John Doe',
    },
    {
      id: 4,
      name: 'Financial software suite',
      customer: 'Wayne Industries',
      value: '$95,000',
      stage: 'Closed Won',
      probability: 100,
      expectedCloseDate: 'Oct 5, 2025',
      owner: 'Emma Williams',
    },
    {
      id: 5,
      name: 'Healthcare analytics platform',
      customer: 'Oscorp LLC',
      value: '$60,000',
      stage: 'Qualification',
      probability: 30,
      expectedCloseDate: 'Feb 15, 2026',
      owner: 'Mike Brown',
    },
  ];

  const statuses = ['All', 'Active', 'Lead', 'Inactive'];
  const industries = ['All', 'Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail'];
  const stages = ['All', 'Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Lead': return 'bg-blue-100 text-blue-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Discovery': return 'bg-blue-100 text-blue-800';
      case 'Qualification': return 'bg-yellow-100 text-yellow-800';
      case 'Proposal': return 'bg-indigo-100 text-indigo-800';
      case 'Negotiation': return 'bg-purple-100 text-purple-800';
      case 'Closed Won': return 'bg-green-100 text-green-800';
      case 'Closed Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 70) return 'bg-green-500';
    if (probability >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customer Relationship Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customers and sales opportunities
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setViewMode('customers')}
            className={`${
              viewMode === 'customers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Customers
          </button>
          <button
            onClick={() => setViewMode('opportunities')}
            className={`${
              viewMode === 'opportunities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`${
              viewMode === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Dashboard
          </button>
        </nav>
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
                placeholder={viewMode === 'customers' ? "Search customers" : "Search opportunities"}
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
                    <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b">
                      {viewMode === 'customers' ? 'Status' : 'Stage'}
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {(viewMode === 'customers' ? statuses : stages).map((item) => (
                        <div key={item} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                          <input
                            id={`filter-${item}`}
                            name={`filter-${item}`}
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`filter-${item}`} className="ml-2 block text-sm text-gray-900">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {viewMode === 'customers' && (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 font-medium border-b border-t">Industry</div>
                        <div className="max-h-48 overflow-y-auto">
                          {industries.map((industry) => (
                            <div key={industry} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                              <input
                                id={`industry-${industry}`}
                                name={`industry-${industry}`}
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`industry-${industry}`} className="ml-2 block text-sm text-gray-900">
                                {industry}
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'customers' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-medium">{customer.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.value}</div>
                    <div className="text-xs flex items-center">
                      {customer.changePercent > 0 ? (
                        <div className="text-green-600 flex items-center">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {customer.changePercent}%
                        </div>
                      ) : (
                        <div className="text-red-600 flex items-center">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          {Math.abs(customer.changePercent)}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Mail className="h-5 w-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'opportunities' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Probability
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Close
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {opportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="ml-0">
                        <div className="text-sm font-medium text-gray-900">{opportunity.name}</div>
                        <div className="text-xs text-gray-500">{opportunity.customer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(opportunity.stage)}`}
                    >
                      {opportunity.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {opportunity.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${getProbabilityColor(opportunity.probability)}`} 
                          style={{ width: `${opportunity.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{opportunity.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opportunity.expectedCloseDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opportunity.owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">10</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">25</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-blue-600 hover:text-blue-900">View all customers</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserPlus className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">New Leads</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">8</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600 hover:text-green-900">View all leads</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Deals</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">12</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-amber-600 hover:text-amber-900">View pipeline</span>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Meetings</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">5</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-purple-600 hover:text-purple-900">View calendar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sales pipeline */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Pipeline</h3>
            </div>
            <div className="p-6">
              <div className="flex h-60 items-end justify-between space-x-2">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 w-16 rounded-t" style={{ height: '80px' }}></div>
                  <div className="mt-2 text-xs text-gray-500">Discovery</div>
                  <div className="text-sm font-medium text-gray-900">$135k</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 w-16 rounded-t" style={{ height: '60px' }}></div>
                  <div className="mt-2 text-xs text-gray-500">Qualification</div>
                  <div className="text-sm font-medium text-gray-900">$95k</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 w-16 rounded-t" style={{ height: '140px' }}></div>
                  <div className="mt-2 text-xs text-gray-500">Proposal</div>
                  <div className="text-sm font-medium text-gray-900">$225k</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 w-16 rounded-t" style={{ height: '120px' }}></div>
                  <div className="mt-2 text-xs text-gray-500">Negotiation</div>
                  <div className="text-sm font-medium text-gray-900">$180k</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 w-16 rounded-t" style={{ height: '100px' }}></div>
                  <div className="mt-2 text-xs text-gray-500">Closed Won</div>
                  <div className="text-sm font-medium text-gray-900">$165k</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 w-16 rounded-t" style={{ height: '40px' }}></div>
                  <div className="mt-2 text-xs text-gray-500">Closed Lost</div>
                  <div className="text-sm font-medium text-gray-900">$75k</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activities and Top customers */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
              </div>
              <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                <li className="p-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Email sent to Acme Corporation</p>
                      <p className="text-sm text-gray-500">
                        Follow-up regarding enterprise software license
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </li>
                <li className="p-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Call with Sarah Johnson from Globex</p>
                      <p className="text-sm text-gray-500">
                        Discussed manufacturing equipment needs
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </li>
                <li className="p-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">Meeting scheduled with Stark Enterprises</p>
                      <p className="text-sm text-gray-500">
                        Product demo for IT services contract
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    View all activity
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Top Customers</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {customers.slice(0, 4).sort((a, b) => parseInt(b.value.replace(/\$|,/g, '')) - parseInt(a.value.replace(/\$|,/g, ''))).map((customer) => (
                  <li key={customer.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 font-medium">{customer.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.industry}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{customer.value}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    View all customers
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};