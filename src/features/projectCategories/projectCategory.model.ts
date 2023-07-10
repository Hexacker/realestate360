import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IProjectCategory from './projectCategory.interface';

const ProjectCategorySchema = new mongoose.Schema({
  name: {
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

ProjectCategorySchema.set('timestamps', true).toString();

const ProjectCategoryModel = mongoose.model<
  IProjectCategory & mongoose.Document
>('ProjectCategory', ProjectCategorySchema, 'project_categories');

export default ProjectCategoryModel;
