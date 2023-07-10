import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import ISale from './sale.interface';

const SaleSchema = new mongoose.Schema({

  recurringPaymentDay: {
    type: Number,
    unique: false,
    required: true,
  },
  finalPrice: {
    type: Number,
    unique: false,
    required: true,
  },
  isActivated: {
    type: Boolean,
    unique: false,
    // required: true,
    default: true,
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  paymentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentPlan',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

SaleSchema.set('timestamps', true).toString();

const SaleModel = mongoose.model<ISale & mongoose.Document>(
  'Sale',
  SaleSchema,
  'sales',
);

export default SaleModel;
