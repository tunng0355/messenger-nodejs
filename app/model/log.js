const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messages = new Schema(
  {
    verify: { type: String, default: "none" },
    files: {
      type: [files],
      default: [],
    },
    audio: { type: String, default: null },
    sticker: { type: String, default: null },
    content: { type: String },
  },
  { _id: false }
);

const files = new Schema(
  {
    url: { type: String },
    type: { type: String },
    thumbnail: { type: String },
    title: { type: String },
    note: { type: String },
  },
  { _id: false }
);

const Table = new Schema(
  {
    ChatID: {
      type: String,
    },
    UserID: {
      type: String,
    },
    messages: {
      type: messages,
      default: {},
    },
    status: {
      type: String,
      default: 'success' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("log", Table);
