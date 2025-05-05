const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    acApiEndpoint: {
      type: String,
      trim: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    config: {
      minTemp: Number,
      maxTemp: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = { Room };
