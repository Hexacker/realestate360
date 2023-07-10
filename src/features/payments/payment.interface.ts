import { IUser } from '../users';
import { IClient } from '../clients';
import { ISale } from '../sales';
import { IBankAccount } from '../bankAccounts';

export default interface IPayment extends Document {
  _id: string;
  amount: number;
  recurringPaymentDay: number;
  isActivated?: boolean;
  isPaid: boolean;
  receiptFile: string;
  receiptDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: IUser;
  lastUpdatedBy?: IUser;
  client: IClient;
  sale: ISale;
  bankAccount: IBankAccount;
}
