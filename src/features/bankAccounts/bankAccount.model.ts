import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IBankAccount from './bankAccount.interface';

const BankAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  bankName: {
    type: String,
    alias: 'bank_name',
    unique: false,
    required: true,
  },
  typeAccount: {
    type: String,
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

BankAccountSchema.set('timestamps', true).toString();

const BankAccountModel = mongoose.model<IBankAccount & mongoose.Document>(
  'BankAccount',
  BankAccountSchema,
  'bank_accounts',
);

export default BankAccountModel;
