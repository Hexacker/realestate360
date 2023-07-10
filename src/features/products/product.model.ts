import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IProduct from './product.interface';
import { ProductStatus } from './enum/status.enum';

const ProductSchema = new mongoose.Schema({
  price: {
    type: Number,
    unique: false,
    required: true,
  },
  salePrice: {
    type: Number,
    unique: false,
    required: true,
  },
  areaTotal: {
    type: Number,
    unique: false,
    required: true,
  },
  status: {
    type: String,
    enum: ProductStatus,
    default: ProductStatus.IN_STOCK,
    unique: false,
    required: true,
  },
  perimeter: {
    type: Object,
    unique: false,
    required: true,
  },
  attachment: {
    type: String,
    unique: false,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductGroup',
  },
  isActivated: {
    type: Boolean,
    unique: false,
    // required: true,
    default: true,
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

ProductSchema.set('timestamps', true).toString();
// ProductSchema.pre("deleteOne", {document:true, query: false}, (next: any) => {
//   console.log('Hello from pre delete product');
// });
// ProductSchema.pre("deleteOne", {document:false, query: true}, (next) => {
//   console.log('%c⧭', 'color: #eeff00', req);
//   console.log('Hello from pre delete product');
// });
const ProductModel = mongoose.model<IProduct & mongoose.Document>(
  'Product',
  ProductSchema,
  'products',
);

export default ProductModel;
