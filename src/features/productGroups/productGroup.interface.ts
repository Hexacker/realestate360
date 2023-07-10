import { IProject } from '../projects';
import { IUser } from '../users';

export default interface IProductGroup extends Document {
  _id: string;
  name: string;
  quantity: number;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  parent: IProductGroup;
  project: IProject;
}
