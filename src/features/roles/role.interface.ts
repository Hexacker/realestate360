import { ICompany } from '../companies';
import { IUser } from '../users';

export default interface IRole {
  _id: string;
  name: string;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  company: ICompany;
  permissions: string[];
}
