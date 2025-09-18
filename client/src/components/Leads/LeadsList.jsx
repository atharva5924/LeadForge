import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";
import { themeBalham } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({});

  const columnDefs = [
    {
      headerName: "Name",
      field: "full_name",
      valueGetter: (params) =>
        `${params.data.first_name} ${params.data.last_name}`,
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Phone",
      field: "phone",
      sortable: true,
      width: 130,
    },
    {
      headerName: "Company",
      field: "company",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "City",
      field: "city",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "State",
      field: "state",
      sortable: true,
      width: 80,
    },
    {
      headerName: "Source",
      field: "source",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params) => {
        const sourceLabels = {
          website: "Website",
          facebook_ads: "Facebook Ads",
          google_ads: "Google Ads",
          referral: "Referral",
          events: "Events",
          other: "Other",
        };
        return sourceLabels[params.value] || params.value;
      },
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params) => {
        const statusColors = {
          new: "bg-blue-100 text-blue-800",
          contacted: "bg-yellow-100 text-yellow-800",
          qualified: "bg-green-100 text-green-800",
          lost: "bg-red-100 text-red-800",
          won: "bg-purple-100 text-purple-800",
        };

        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              statusColors[params.value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
          </span>
        );
      },
    },
    {
      headerName: "Score",
      field: "score",
      sortable: true,
      filter: "agNumberColumnFilter",
      width: 100,
      cellRenderer: (params) => {
        const score = params.value;
        const color =
          score >= 80
            ? "text-green-600"
            : score >= 60
            ? "text-yellow-600"
            : "text-red-600";
        return <span className={`${color} font-semibold`}>{score}</span>;
      },
    },
    {
      headerName: "Lead Value",
      field: "lead_value",
      sortable: true,
      filter: "agNumberColumnFilter",
      width: 120,
      valueFormatter: (params) => `$${params.value?.toLocaleString() || 0}`,
    },
    {
      headerName: "Qualified",
      field: "is_qualified",
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: (params) =>
        params.value ? (
          <span className="text-green-600">✓</span>
        ) : (
          <span className="text-gray-400">✗</span>
        ),
    },
    {
      headerName: "Created",
      field: "created_at",
      sortable: true,
      filter: "agDateColumnFilter",
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEdit: (id) => handleEdit(id),
        onDelete: (id) => handleDelete(id),
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  function ActionsCellRenderer(props) {
    const { data, onEdit, onDelete } = props;

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(data._id)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(data._id)}
          className="text-red-600 hover:text-red-800"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const handleEdit = (id) => {
    window.location.href = `/leads/${id}/edit`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await axios.delete(`/leads/${id}`);
      toast.success("Lead deleted successfully");
      fetchLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (Object.keys(filters).length > 0) {
        params.append("filters", JSON.stringify(filters));
      }

      const response = await axios.get(`/leads?${params}`);
      setLeads(response.data.data || []);
      setPagination({
        page: response.data.pagination?.page || 1,
        limit: response.data.pagination?.limit || 20,
        total: response.data.pagination?.total || 0,
        totalPages: response.data.pagination?.totalPages || 1,
      });
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">{pagination.total} total leads</p>
        </div>
        <Link
          to="/leads/new"
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Lead</span>
        </Link>
      </div>
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.status?.equals || ""}
              onChange={(e) => {
                const newFilters = { ...filters };
                if (e.target.value) {
                  newFilters.status = { equals: e.target.value };
                } else {
                  delete newFilters.status;
                }
                setFilters(newFilters);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
              <option value="won">Won</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filters.source?.equals || ""}
              onChange={(e) => {
                const newFilters = { ...filters };
                if (e.target.value) {
                  newFilters.source = { equals: e.target.value };
                } else {
                  delete newFilters.source;
                }
                setFilters(newFilters);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="facebook_ads">Facebook Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="referral">Referral</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search company..."
              value={filters.company?.contains || ""}
              onChange={(e) => {
                const newFilters = { ...filters };
                if (e.target.value) {
                  newFilters.company = { contains: e.target.value };
                } else {
                  delete newFilters.company;
                }
                setFilters(newFilters);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualified
            </label>
            <select
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={
                filters.is_qualified !== undefined
                  ? filters.is_qualified.toString()
                  : ""
              }
              onChange={(e) => {
                const newFilters = { ...filters };
                if (e.target.value !== "") {
                  newFilters.is_qualified = e.target.value === "true";
                } else {
                  delete newFilters.is_qualified;
                }
                setFilters(newFilters);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <option value="">All</option>
              <option value="true">Qualified</option>
              <option value="false">Not Qualified</option>
            </select>
          </div>
        </div>
        {Object.keys(filters).length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => {
                setFilters({});
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="inline-flex justify-center py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {/* Data Grid Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={leads}
            defaultColDef={defaultColDef}
            pagination={false}
            loading={loading}
            suppressPaginationPanel={true}
            domLayout="normal"
            theme={themeBalham}
          />
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={pagination.limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              {(pagination.page - 1) * pagination.limit + 1}-{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsList;
