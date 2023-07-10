import * as faker from 'faker';
import { PaymentDTO } from '../../features/payments';
import { IUser, User } from '../../features/users';
import { IClient, Client } from '../../features/clients';
import { IBankAccount, BankAccount } from '../../features/bankAccounts';
import { ISale, Sale } from '../../features/sales';

const payments = async (): Promise<PaymentDTO[]> => {
  const paymentsData: PaymentDTO[] = [];
  const users: IUser[] = await User.find();
  const clients: IClient[] = await Client.find();
  const sales: ISale[] = await Sale.find();
  const bankAccounts: IBankAccount[] = await BankAccount.find();
  let i: number;
  i = 1;
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const dueDate = new Date();
    const payment: PaymentDTO = new PaymentDTO();
    payment.amount = faker.random.float({
      min: 0,
      max: 10000,
      precision: 0.01,
    });
    payment.isPaid = !!(i % 2);
    payment.isActivated = true;
    payment.receiptFile = faker.image.avatar();
    payment.receiptDate = new Date();
    payment.dueDate = dueDate;
    payment.recurringPaymentDay = faker.random.number(30);
    dueDate.setDate(
      payment.receiptDate.getDate() + payment.recurringPaymentDay,
    );
    payment.clientId = clients[i % clients.length]._id;
    payment.lastUpdatedBy = users[i % users.length]._id;
    payment.saleId = sales[i % sales.length]._id;
    payment.bankAccountId = bankAccounts[i % bankAccounts.length]._id;
    paymentsData.push(payment);
  }
  return paymentsData;
};
export default payments;
