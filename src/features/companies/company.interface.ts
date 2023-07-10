import { IUser } from '../users';

export default interface ICompany extends Document {
  _id: string;
  name: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  logoUrl: string;
  numEmployees: number;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  admins: IUser[];
}
