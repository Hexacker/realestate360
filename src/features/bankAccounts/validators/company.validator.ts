/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { CompaniesService } from '../../companies';
import BankAccountDTO from '../dto/bankAccount.dto';

@ValidatorConstraint({ async: true })
export class IsCompanyExists {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(companyId: string) {
    const companyFound = await CompaniesService.getCompany(companyId);
    return !!(companyFound && companyFound.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `company with _id: "${
      (args.object as BankAccountDTO).companyId
    }" does not exist or not active!`;
  }
}
