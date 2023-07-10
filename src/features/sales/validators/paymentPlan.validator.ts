import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import SaleDTO from '../dto/sale.dto';
import { PaymentPlansService } from '../../paymentPlans';

@ValidatorConstraint({ async: true })
export class IsPaymentPlanValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(paymentPlanId: string) {
    const paymentPlanFound = await PaymentPlansService.getPaymentPlan(paymentPlanId);
    return !!(paymentPlanFound && paymentPlanFound.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `payment plan with _id: "${
      (args.object as SaleDTO).paymentPlanId
    }" does not exist!`;
  }
}
