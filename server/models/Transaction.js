import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  customerId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Product list with quantity for proper billing
  products:    [
    { 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      priceAtPurchase: { type: Number } // Important: price can change later, bill shouldn't
    }
  ],
  amount:      { type: Number, required: true },
  paymentType: { type: String, enum: ["cash", "card", "upi", "online"], default: "cash" },
  tableNumber: { type: Number },
  status:      { type: String, enum: ["pending","completed","cancelled"], default: "pending" },
  branchId:    { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
}, { timestamps: true });

export default mongoose.model("Transaction", TransactionSchema);