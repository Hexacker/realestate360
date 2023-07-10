import payments from './data/payments.data';
import PaymentsService from '../features/payments/payments.service';
import { PaymentDTO } from '../features/payments';

const seedPayments = async (): Promise<void> => {
  try {
    const paymentsData: PaymentDTO[] = await payments();
    // eslint-disable-next-line no-restricted-syntax
    for (const payment of paymentsData) {
      // eslint-disable-next-line no-await-in-loop
      await PaymentsService.createPayment(payment);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error payments seeds ${error}`);
  }
};

export default seedPayments;
