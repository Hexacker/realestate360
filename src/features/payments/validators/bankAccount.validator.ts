import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { BankAccountsService } from '../../bankAccounts';
import PaymentDTO from '../dto/payment.dto';

@ValidatorConstraint({ async: true })
export class IsBankAccountValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(bankAccountId: string) {
    const bankAccountFound = await BankAccountsService.getBankAccount(bankAccountId);
    return !!(bankAccountFound && bankAccountFound.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `bank account with _id: "${
      (args.object as PaymentDTO).bankAccountId
    }" does not exist or not active!`;
  }
}
