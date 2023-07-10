import paymentPlans from './data/paymentPlans.data';
import paymentPlanService from '../features/paymentPlans/paymentPlans.service';
import { PaymentPlanDTO } from '../features/paymentPlans';

const seedPaymentPlan = async (): Promise<void> => {
  try {
    const paymentPlanData: PaymentPlanDTO[] = await paymentPlans();
    // eslint-disable-next-line no-restricted-syntax
    for (const paymentPlan of paymentPlanData) {
      // eslint-disable-next-line no-await-in-loop
      await paymentPlanService.createPaymentPlan(paymentPlan);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error payment plans seeds ${error}`);
  }
};

export default seedPaymentPlan;
