import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IPaymentPlan from './paymentPlan.interface';

const PaymentPlanSchema = new mongoose.Schema({
  isCredit: {
    type: Boolean,
    unique: false,
    required: true,
    default: false,
  },
  downPayment: {
    type: Number,
    unique: false,
    required: true,
  },
  finalPayment: {
    type: Number,
    unique: false,
    required: true,
  },
  frequency: {
    type: Number,
    unique: false,
    required: true,
  },
  amount: {
    type: Number,
    unique: false,
    required: true,
  },
  interestRate: {
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
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
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

PaymentPlanSchema.set('timestamps', true).toString();

const PaymentPlanModel = mongoose.model<IPaymentPlan & mongoose.Document>(
  'PaymentPlan',
  PaymentPlanSchema,
  'payment_plans',
);

export default PaymentPlanModel;
