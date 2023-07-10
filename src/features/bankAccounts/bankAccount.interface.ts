import { ICompany } from '../companies';
import { IUser } from '../users';

export default interface IBankAccount extends Document {
  _id: string;
  name: string;
  bankName: string;
  typeAccount: string;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  company: ICompany;
}
