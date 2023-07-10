import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IPayment from './payment.interface';

const PaymentSchema = new mongoose.Schema({

  amount: {
    type: Number,
    unique: false,
    required: true,
  },
  recurringPaymentDay: {
    type: Number,
    unique: false,
    required: true,
  },
  receiptFile: {
    type: String,
    unique: false,
    required: true,
  },
  receiptDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  isActivated: {
    type: Boolean,
    unique: false,
    // required: true,
    default: true,
  },
  isPaid: {
    type: Boolean,
    unique: false,
    required: true,
    default: false,
  },
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
  },
  bankAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BankAccount',
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

PaymentSchema.set('timestamps', true).toString();

const PaymentModel = mongoose.model<IPayment & mongoose.Document>(
  'Payment',
  PaymentSchema,
  'payments',
);

export default PaymentModel;
