// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   // Personal Information
//   first_name: {
//     type: String,
//     required: [true, 'First name is required'],
//     trim: true,
//     maxlength: [100, 'First name cannot exceed 100 characters']
//   },
//   last_name: {
//     type: String,
//     required: [true, 'Last name is required'],
//     trim: true,
//     maxlength: [100, 'Last name cannot exceed 100 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     maxlength: [255, 'Email cannot exceed 255 characters'],
//     validate: {
//       validator: function(email) {
//         return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
//       },
//       message: 'Please enter a valid email address'
//     }
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     trim: true,
//     minlength: [10, 'Phone number must be at least 10 characters'],
//     maxlength: [20, 'Phone number cannot exceed 20 characters']
//   },

//   // Company Information
//   company: {
//     type: String,
//     required: [true, 'Company is required'],
//     trim: true,
//     maxlength: [200, 'Company name cannot exceed 200 characters']
//   },
//   city: {
//     type: String,
//     required: [true, 'City is required'],
//     trim: true,
//     maxlength: [100, 'City name cannot exceed 100 characters']
//   },
//   state: {
//     type: String,
//     required: [true, 'State is required'],
//     trim: true,
//     maxlength: [100, 'State name cannot exceed 100 characters']
//   },

//   // Lead Classification
//   source: {
//     type: String,
//     enum: {
//       values: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
//       message: 'Source must be one of: website, facebook_ads, google_ads, referral, events, other'
//     },
//     required: [true, 'Source is required']
//   },
//   status: {
//     type: String,
//     enum: {
//       values: ['new', 'contacted', 'qualified', 'lost', 'won'],
//       message: 'Status must be one of: new, contacted, qualified, lost, won'
//     },
//     default: 'new'
//   },

//   // Scoring and Value
//   score: {
//     type: Number,
//     min: [0, 'Score must be at least 0'],
//     max: [100, 'Score cannot exceed 100'],
//     default: 0,
//     validate: {
//       validator: Number.isInteger,
//       message: 'Score must be an integer'
//     }
//   },
//   lead_value: {
//     type: Number,
//     min: [0, 'Lead value must be positive'],
//     default: 0,
//     validate: {
//       validator: function(value) {
//         return value >= 0;
//       },
//       message: 'Lead value must be a positive number'
//     }
//   },

//   // Tracking Fields
//   last_activity_at: {
//     type: Date,
//     default: null
//   },
//   is_qualified: {
//     type: Boolean,
//     default: false
//   },

//   // Relationship to User
//   created_by: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Created by user is required']
//   }
// }, {
//   timestamps: { 
//     createdAt: 'created_at', 
//     updatedAt: 'updated_at' 
//   }
// });

// // Indexes for better performance
// leadSchema.index({ email: 1 });
// leadSchema.index({ created_by: 1 });
// leadSchema.index({ status: 1 });
// leadSchema.index({ source: 1 });
// leadSchema.index({ company: 1 });
// leadSchema.index({ created_at: -1 });
// leadSchema.index({ score: -1 });
// leadSchema.index({ lead_value: -1 });
// leadSchema.index({ is_qualified: 1 });

// // Compound indexes for common queries
// leadSchema.index({ created_by: 1, status: 1 });
// leadSchema.index({ created_by: 1, source: 1 });
// leadSchema.index({ created_by: 1, is_qualified: 1 });
// leadSchema.index({ created_by: 1, created_at: -1 });

// // Virtual for full name
// leadSchema.virtual('full_name').get(function() {
//   return `${this.first_name} ${this.last_name}`;
// });

// // Virtual for days since creation
// leadSchema.virtual('days_since_created').get(function() {
//   if (!this.created_at) return 0;
//   const now = new Date();
//   const diffTime = Math.abs(now - this.created_at);
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// });

// // Virtual for days since last activity
// leadSchema.virtual('days_since_last_activity').get(function() {
//   if (!this.last_activity_at) return null;
//   const now = new Date();
//   const diffTime = Math.abs(now - this.last_activity_at);
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// });

// // Pre-save middleware
// leadSchema.pre('save', function(next) {
//   // Capitalize first letter of names
//   if (this.first_name) {
//     this.first_name = this.first_name.charAt(0).toUpperCase() + this.first_name.slice(1).toLowerCase();
//   }
//   if (this.last_name) {
//     this.last_name = this.last_name.charAt(0).toUpperCase() + this.last_name.slice(1).toLowerCase();
//   }
  
//   // Capitalize company, city, state
//   if (this.company) {
//     this.company = this.company.split(' ').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//     ).join(' ');
//   }
  
//   if (this.city) {
//     this.city = this.city.charAt(0).toUpperCase() + this.city.slice(1).toLowerCase();
//   }
  
//   if (this.state) {
//     this.state = this.state.toUpperCase();
//   }

//   next();
// });

// // Static method to get lead statistics
// leadSchema.statics.getStatistics = async function(userId) {
//   return this.aggregate([
//     { $match: { created_by: userId } },
//     {
//       $group: {
//         _id: null,
//         totalLeads: { $sum: 1 },
//         totalValue: { $sum: '$lead_value' },
//         avgScore: { $avg: '$score' },
//         avgValue: { $avg: '$lead_value' },
//         qualifiedCount: {
//           $sum: { $cond: ['$is_qualified', 1, 0] }
//         },
//         newCount: {
//           $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
//         },
//         contactedCount: {
//           $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] }
//         },
//         qualifiedStatusCount: {
//           $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] }
//         },
//         lostCount: {
//           $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] }
//         },
//         wonCount: {
//           $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] }
//         }
//       }
//     }
//   ]);
// };

// // Instance method to update last activity
// leadSchema.methods.updateLastActivity = function() {
//   this.last_activity_at = new Date();
//   return this.save();
// };

// // Instance method to qualify lead
// leadSchema.methods.qualify = function() {
//   this.is_qualified = true;
//   this.status = 'qualified';
//   return this.save();
// };

// module.exports = mongoose.model('Lead', leadSchema);
