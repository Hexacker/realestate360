import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IClient from './client.interface';

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    unique: false,
    required: true,
  },
  source: {
    type: String,
    unique: false,
    required: true,
  },
  isActivated: {
    type: Boolean,
    unique: false,
    required: false,
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

ClientSchema.set('timestamps', true).toString();

const ClientModel = mongoose.model<IClient & mongoose.Document>(
  'Client',
  ClientSchema,
  'clients',
);

export default ClientModel;
