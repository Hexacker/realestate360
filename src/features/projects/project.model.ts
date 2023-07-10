import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IProject from './project.interface';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
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
  currency: {
    type: String,
    unique: false,
    required: true,
  },
  areaTotal: {
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
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectCategory',
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

ProjectSchema.set('timestamps', true).toString();

const ProjectModel = mongoose.model<IProject & mongoose.Document>(
  'Project',
  ProjectSchema,
  'projects',
);

export default ProjectModel;
