import { ICompany } from '../companies';
import { IUser } from '../users';

export default interface IPaymentPlan extends Document {
  _id: string;
  isCredit: boolean;
  downPayment: number;
  finalPayment: number;
  frequency: number;
  amount: number;
  interestRate: number;
  isActivated?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  company: ICompany;
}
