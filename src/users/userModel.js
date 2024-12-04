const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      default: "buyer",
    },
    salt: {
      type: String,
      required: true,
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// Exportation du modèle
const User = mongoose.model("User", userSchema);

module.exports = User;
