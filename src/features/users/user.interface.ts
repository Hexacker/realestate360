import { IRole } from '../roles';

export default interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePicture?: string;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  roles: IRole[];
}
