import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import ICompany from './company.interface';

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    unique: false,
    required: true,
  },
  state: {
    type: String,
    unique: false,
    required: true,
  },
  city: {
    type: String,
    unique: false,
    required: true,
  },
  phone: {
    type: String,
    unique: false,
    required: true,
  },
  logoUrl: {
    type: String,
    unique: false,
    required: true,
  },
  numEmployees: {
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
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

CompanySchema.set('timestamps', true).toString();

const CompanyModel = mongoose.model<ICompany & mongoose.Document>(
  'Company',
  CompanySchema,
  'companies',
);

export default CompanyModel;
