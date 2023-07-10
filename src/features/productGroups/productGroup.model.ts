import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IProductGroup from './productGroup.interface';

const ProductGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  quantity: {
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
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductGroup',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
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

ProductGroupSchema.set('timestamps', true).toString();

const ProductGroupModel = mongoose.model<IProductGroup & mongoose.Document>(
  'ProductGroup',
  ProductGroupSchema,
  'product_groups'
);

export default ProductGroupModel;
