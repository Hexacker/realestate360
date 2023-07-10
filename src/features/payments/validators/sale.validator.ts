import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { SalesService } from '../../sales';
import PaymentDTO from '../dto/payment.dto';

@ValidatorConstraint({ async: true })
export class IsSaleValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(saleId: string) {
    const saleFound = await SalesService.getSale(saleId);
    return !!(saleFound && saleFound.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `sale with _id: "${
      (args.object as PaymentDTO).saleId
    }" does not exist or not active!`;
  }
}
