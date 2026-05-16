const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  thumbnail: {
    url: String,
    publicId: String,
  },
  video: {
    url: String,
    publicId: String,
  },
  technologies: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  category: {
    type: String,
    enum: ['shopify', 'fullstack', 'frontend', 'backend', 'other'],
    default: 'other'
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

projectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
