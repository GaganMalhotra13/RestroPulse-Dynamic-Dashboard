import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cost: { // 🚨 Puraane 'amount' ko replace karke 'cost' kiya
      type: String, 
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",
      }
    ],
    paymentType: {
      type: String,
      default: "cash"
    },orderType: { type: String, default: "Dine-In" },
    staffName: { type: String },
    staffRole: { type: String },status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;