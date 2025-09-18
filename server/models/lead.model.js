import mongoose, { Schema } from "mongoose";

const leadSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: [
        "website",
        "facebook_ads",
        "google_ads",
        "referral",
        "events",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new",
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    lead_value: {
      type: Number,
      default: 0,
    },
    last_activity_at: {
      type: Date,
      default: null,
    },
    is_qualified: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Create index for better search performance
// leadSchema.index({ email: 1 });
leadSchema.index({ company: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ created_by: 1 });

leadSchema.statics.getStatistics = async function (userId) {
  return this.aggregate([
    { $match: { created_by: userId } },
    {
      $group: {
        _id: null,
        totalLeads: { $sum: 1 },
        totalValue: { $sum: "$lead_value" },
        avgScore: { $avg: "$score" },
        avgValue: { $avg: "$lead_value" },
        qualifiedCount: { $sum: { $cond: ["$is_qualified", 1, 0] } },
        newCount: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
        contactedCount: {
          $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
        },
        qualifiedStatusCount: {
          $sum: { $cond: [{ $eq: ["$status", "qualified"] }, 1, 0] },
        },
        lostCount: { $sum: { $cond: [{ $eq: ["$status", "lost"] }, 1, 0] } },
        wonCount: { $sum: { $cond: [{ $eq: ["$status", "won"] }, 1, 0] } },
      },
    },
  ]);
};

export const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
