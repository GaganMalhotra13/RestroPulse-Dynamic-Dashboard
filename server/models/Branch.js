import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String },
  lat:      { type: Number },
  lng:      { type: Number },
  managerId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Branch", BranchSchema);