import Perimeter from '../../helpers/perimeter.class';
import { IProductGroup } from '../productGroups';
import { ProductStatus } from './enum/status.enum';
import { IUser } from '../users';

export default interface IProduct extends Document {
  _id: string;
  price: number;
  salePrice: number;
  areaTotal: number;
  status: ProductStatus;
  attachment: string;
  perimeter: Perimeter;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  group: IProductGroup;
}
