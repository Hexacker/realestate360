import * as faker from 'faker';
import { Company, ICompany } from '../../features/companies';
import { PaymentPlanDTO } from '../../features/paymentPlans';

const paymenPlans = async (): Promise<PaymentPlanDTO[]> => {
  const paymenPlansData: PaymentPlanDTO[] = [];
  let i: number;
  i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  const companies: ICompany[] = await Company.find();

  for (i; i <= 10; i += 1) {
    const paymentPlan: PaymentPlanDTO = new PaymentPlanDTO();
    paymentPlan.isActivated = true;
    paymentPlan.isCredit = !!(i % 2);
    paymentPlan.frequency = faker.random.number({ min: 1, max: 100 });
    paymentPlan.amount = faker.random.float({
      min: 0,
      max: 1000000,
      precision: 0.01,
    });
    paymentPlan.interestRate = faker.random.float({
      min: 0,
      max: 5.7,
      precision: 0.01,
    });
    paymentPlan.downPayment = faker.random.float({
      min: 0,
      max: paymentPlan.amount,
      precision: 0.01,
    });
    paymentPlan.finalPayment =
      paymentPlan.amount * paymentPlan.interestRate +
      paymentPlan.amount * paymentPlan.interestRate -
      paymentPlan.downPayment;
    // paymentPlan.
    paymentPlan.companyId = companies[i % companies.length]._id;

    paymenPlansData.push(paymentPlan);
  }
  return paymenPlansData;
};
export default paymenPlans;
