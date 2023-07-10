import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Company, ICompany } from '../../companies';
import ClientDTO from '../dto/client.dto';

@ValidatorConstraint({ async: true })
export class IsCompanyIdValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(id: string) {
    const company: ICompany | null = await Company.findById(id);
    return !!(company && company.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `Company with id: "${(args.object as ClientDTO).companyId}" does not exists or not active!`;
  }
}
