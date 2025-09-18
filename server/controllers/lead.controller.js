import {Lead} from "../models/lead.model.js";
import { buildFilterQuery } from "../utils/builderFilterQuery.js";
import { validationResult } from "express-validator";

const getLeads = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    let filters = {};
    if (req.query.filters) {
      try {
        filters = JSON.parse(req.query.filters);
      } catch (e) {
        return res.status(400).json({
          message: "Invalid filters format. Must be valid JSON.",
        });
      }
    }

    const query = buildFilterQuery(filters, req.user._id);

    const total = await Lead.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const sort = {};
    sort[sortBy] = sortOrder;

    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-created_by -__v");

    res.status(200).json({
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: filters,
      sort: { sortBy, sortOrder: req.query.sortOrder || "desc" },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      message: "Internal server error while fetching leads",
    });
  }
};

const getSingleLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid lead ID format",
      });
    }

    const lead = await Lead.findOne({
      _id: id,
      created_by: req.user._id,
    }).select("-created_by -__v");

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid lead ID format",
      });
    }
    res.status(500).json({
      message: "Internal server error while fetching lead",
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid lead ID format",
      });
    }

    const existingLead = await Lead.findOne({
      _id: id,
      created_by: req.user._id,
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (req.body.email && req.body.email !== existingLead.email) {
      const emailConflict = await Lead.findOne({
        email: req.body.email,
        created_by: req.user._id,
        _id: { $ne: id },
      });

      if (emailConflict) {
        return res.status(409).json({
          message: "Another lead with this email already exists",
        });
      }
    }

    const updateData = { ...req.body };

    if (req.body.last_activity_at) {
      updateData.last_activity_at = new Date(req.body.last_activity_at);
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).select("-created_by -__v");

    res.status(200).json({
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Error updating lead:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid lead ID format",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Another lead with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: "Internal server error while updating lead",
    });
  }
};

const createLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation error",
        errors: errors.array(),
      });
    }

    const existingLead = await Lead.findOne({
      email: req.body.email,
      created_by: req.user._id,
    });

    if (existingLead) {
      return res.status(409).json({
        message: "A lead with this email already exists",
      });
    }

    const leadData = {
      ...req.body,
      created_by: req.user._id,
    };

    if (req.body.last_activity_at) {
      leadData.last_activity_at = new Date(req.body.last_activity_at);
    }

    const lead = new Lead(leadData);
    await lead.save();

    const createdLead = await Lead.findById(lead._id).select(
      "-created_by -__v"
    );

    res.status(201).json({
      message: "Lead created successfully",
      data: createdLead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A lead with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: "Internal server error while creating lead",
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid lead ID format",
      });
    }

    const deletedLead = await Lead.findOneAndDelete({
      _id: id,
      created_by: req.user._id,
    });

    if (!deletedLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
      data: { id: deletedLead._id },
    });
  } catch (error) {
    console.error("Error deleting lead:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid lead ID format",
      });
    }

    res.status(500).json({
      message: "Internal server error while deleting lead",
    });
  }
};

const summaryStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Lead.aggregate([
      { $match: { created_by: userId } },
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                totalValue: { $sum: "$lead_value" },
                avgScore: { $avg: "$score" },
                avgValue: { $avg: "$lead_value" },
              },
            },
          ],
          statusBreakdown: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          sourceBreakdown: [
            {
              $group: {
                _id: "$source",
                count: { $sum: 1 },
              },
            },
          ],
          qualifiedStats: [
            {
              $group: {
                _id: "$is_qualified",
                count: { $sum: 1 },
              },
            },
          ],
          recentLeads: [
            { $sort: { created_at: -1 } },
            { $limit: 5 },
            {
              $project: {
                first_name: 1,
                last_name: 1,
                email: 1,
                company: 1,
                status: 1,
                created_at: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = stats;

    res.status(200).json({
      summary: result.totalStats || {
        totalLeads: 0,
        totalValue: 0,
        avgScore: 0,
        avgValue: 0,
      },
      breakdowns: {
        status: result.statusBreakdown,
        source: result.sourceBreakdown,
        qualified: result.qualifiedStats,
      },
      recentLeads: result.recentLeads,
    });
  } catch (error) {
    console.error("Error fetching lead statistics:", error);
    res.status(500).json({
      message: "Internal server error while fetching statistics",
    });
  }
};

export { createLead, getSingleLead, getLeads, updateLead, deleteLead, summaryStats };
