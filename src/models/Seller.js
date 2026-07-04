const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    reliabilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    responseTimeSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seller', sellerSchema);
