import { ICompany } from '../companies';
import { IUser } from '../users';

export default interface IClient extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  company: ICompany;
}
