import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  PlusIcon,
  ChartBarIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    totalValue: 0,
    conversionRate: 0,
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const leadsResponse = await axios.get("/leads?limit=100");
      const leads = leadsResponse.data.data;

      const totalLeads = leads.length;
      const newLeads = leads.filter((lead) => lead.status === "new").length;
      const qualifiedLeads = leads.filter((lead) => lead.is_qualified).length;
      const totalValue = leads.reduce(
        (sum, lead) => sum + (lead.lead_value || 0),
        0
      );
      const wonLeads = leads.filter((lead) => lead.status === "won").length;
      const conversionRate =
        totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

      setStats({
        totalLeads,
        newLeads,
        qualifiedLeads,
        totalValue,
        conversionRate,
      });

      setRecentLeads(leads.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-md shadow p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-8 w-8 `} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
          <p className="text-sm text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md shadow">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6  min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your lead overview.
          </p>
        </div>
        <Link
          to="/leads/new"
          className="inline-flex btn btn-primary  items-center space-x-2 px-4 py-2 rounded-md"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Lead</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={UserGroupIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={PlusIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Qualified Leads"
          value={stats.qualifiedLeads}
          icon={CheckCircleIcon}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          color="bg-yellow-500"
        />
      </div>

      {/* Additional Stats */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-md shadow p-6 ">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Rate
          </h3>
          <div className="flex items-center">
            <ArrowUpIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.conversionRate}%
              </span>
              <p className="text-sm text-gray-600">Leads converted to won</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Lead Value:</span>
              <span className="text-sm font-medium">
                $
                {stats.totalLeads > 0
                  ? (stats.totalValue / stats.totalLeads).toFixed(2)
                  : "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Qualification Rate:</span>
              <span className="text-sm font-medium">
                {stats.totalLeads > 0
                  ? ((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
        
      </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-md shadow p-6 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Rate
          </h3>
          <div className="flex flex-col items-center">
            {/* Arrow and Percentage */}
            <div className="flex items-center justify-center mb-2">
              <ArrowUpIcon className="h-8 w-8 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.conversionRate}%
              </span>
            </div>
            {/* Subtitle */}
            <p className="text-sm text-gray-600">Leads converted to won</p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow p-6 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3 w-full max-w-xs">
            <div className="space-y-3 w-full mx-auto">
              <div className="flex items-center justify-center gap-x-2">
                <span className="text-sm text-gray-600">
                  Average Lead Value:
                </span>
                <span className="text-sm font-medium">
                  $
                  {stats.totalLeads > 0
                    ? (stats.totalValue / stats.totalLeads).toFixed(2)
                    : "0"}
                </span>
              </div>
              <div className="flex items-center justify-center gap-x-2">
                <span className="text-sm text-gray-600">
                  Qualification Rate:
                </span>
                <span className="text-sm font-medium">
                  {stats.totalLeads > 0
                    ? ((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(
                        1
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-md shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <Link
            to="/leads"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>

        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          lead.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : lead.status === "contacted"
                            ? "bg-yellow-100 text-yellow-800"
                            : lead.status === "qualified"
                            ? "bg-green-100 text-green-800"
                            : lead.status === "lost"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {lead.status.charAt(0).toUpperCase() +
                          lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${lead.lead_value?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No leads yet. Create your first lead!
            </p>
            <Link
              to="/leads/new"
              className="btn btn-primary mt-4 inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Lead
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
