import { IUser } from '../users';
import IPaymentPlan from '../paymentPlans/paymentPlan.interface';
import { IProduct } from '../products';
import { IClient } from '../clients';

export default interface ISale extends Document {
  _id: string;
  recurringPaymentDay: number;
  finalPrice: number;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  soldBy: IUser;
  product: IProduct;
  client: IClient;
  paymentPlan: IPaymentPlan;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
}
