import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { ClientsService } from '../../clients';
import PaymentDTO from '../dto/payment.dto';

@ValidatorConstraint({ async: true })
export class IsClientValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(clientId: string) {
    const clientFound = await ClientsService.getClient(clientId);
    return !!(clientFound && clientFound.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `client with _id: "${
      (args.object as PaymentDTO).clientId
    }" does not exist or not active!`;
  }
}
