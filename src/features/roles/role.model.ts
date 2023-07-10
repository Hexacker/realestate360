import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IRole from './role.interface';

const RoleSchema = new mongoose.Schema({
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
  permissions: [
    {
      type: String,
    },
  ],
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

RoleSchema.set('timestamps', true).toString();

const RoleModel = mongoose.model<IRole & mongoose.Document>(
  'Role',
  RoleSchema,
  'roles',
);

export default RoleModel;
