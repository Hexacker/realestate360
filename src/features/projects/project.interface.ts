import { ICompany } from '../companies';
import { ICountry } from '../countries';
import { IProduct } from '../products';
import { IProjectCategory } from '../projectCategories';
import { IUser } from '../users';

export default interface IProject extends Document {
  _id: string;
  name: string;
  address: string;
  state: string;
  city: string;
  currency: string;
  areaTotal: number;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  country: ICountry;
  company: ICompany;
  products: IProduct[];
  categories: IProjectCategory[];
}
