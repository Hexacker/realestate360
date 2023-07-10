import { IUser } from '../users';
import { IProduct } from '../products';
import { IPaymentPlan } from '../paymentPlans';

export default interface IQuote extends Document {
  _id: string;
  price: number;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  product: IProduct;
  paymentPlan: IPaymentPlan;
}
