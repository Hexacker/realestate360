import * as faker from 'faker';
import { SaleDTO } from '../../features/sales';
import { IUser, User } from '../../features/users';
import { IProduct, Product } from '../../features/products';
import { IPaymentPlan, PaymentPlan } from '../../features/paymentPlans';
import { IClient, Client } from '../../features/clients';

const sales = async (): Promise<SaleDTO[]> => {
  const salesData: SaleDTO[] = [];
  const users: IUser[] = await User.find();
  const clients: IClient[] = await Client.find();
  const products: IProduct[] = await Product.find();
  const paymentPlans: IPaymentPlan[] = await PaymentPlan.find();
  let i: number;
  i = 1;
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const sale: SaleDTO = new SaleDTO();
    sale.finalPrice = faker.random.float({
      min: 0,
      max: 10000,
      precision: 0.01,
    });
    sale.recurringPaymentDay = faker.random.number(10);
    sale.clientId = clients[i % clients.length]._id;
    sale.soldBy = users[i % users.length]._id;
    sale.productId = products[i % products.length]._id;
    sale.paymentPlanId = paymentPlans[i % paymentPlans.length]._id;
    sale.isActivated = true;
    salesData.push(sale);
  }
  return salesData;
};
export default sales;
