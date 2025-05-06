const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

voteSchema.index({ room: 1, user: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

module.exports = { Vote };
