import CountryCode from './helpers/country.code';
import { IUser } from '../users';

export default interface ICountry extends Document {
  _id: string;
  name: string;
  code: CountryCode;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
}
