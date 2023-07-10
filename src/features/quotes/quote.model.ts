import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import IQuote from './quote.interface';

const QuoteSchema = new mongoose.Schema({

  price: {
    type: Number,
    unique: false,
    required: true,
  },
  isActivated: {
    type: Boolean,
    unique: false,
    required: false,
    default: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  paymentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentPlan',
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

QuoteSchema.set('timestamps', true).toString();

const QuoteModel = mongoose.model<IQuote & mongoose.Document>(
  'Quote',
  QuoteSchema,
  'quotes',
);

export default QuoteModel;
