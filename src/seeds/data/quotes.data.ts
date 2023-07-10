import * as faker from 'faker';
import { QuoteDTO } from '../../features/quotes';
import { IUser, User } from '../../features/users';
import { IProduct, Product } from '../../features/products';
import { IPaymentPlan, PaymentPlan } from '../../features/paymentPlans';

const quotes = async (): Promise<QuoteDTO[]> => {
  const quotesData: QuoteDTO[] = [];
  const users: IUser[] = await User.find();
  const products: IProduct[] = await Product.find();
  const paymentPlans: IPaymentPlan[] = await PaymentPlan.find();
  let i: number;
  i = 0;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const quote: QuoteDTO = new QuoteDTO();
    quote.price = faker.random.float({
      min: 0,
      max: 10000,
      precision: 0.01,
    });
    quote.createdBy = users[i % users.length]._id;
    quote.productId = products[i % products.length]._id;
    quote.paymentPlanId = paymentPlans[i % paymentPlans.length]._id;
    quote.isActivated = true;
    quotesData.push(quote);
  }
  return quotesData;
};
export default quotes;
