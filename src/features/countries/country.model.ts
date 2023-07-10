import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
import ICountry from './country.interface';

const CountrySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  code: {
    type: Object,
    unique: false,
    required: true,
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

CountrySchema.set('timestamps', true).toString();

const CountryModel = mongoose.model<ICountry & mongoose.Document>(
  'Country',
  CountrySchema,
  'countries',
);

export default CountryModel;
