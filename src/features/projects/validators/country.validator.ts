import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { Country, ICountry } from '../../countries';
import ProjectDTO from '../dto/project.dto';

@ValidatorConstraint({ async: true })
export class IsCountryIdValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(id: string) {
    const country: ICountry | null = await Country.findById(id);
    return !!(country && country.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `country with id: "${(args.object as ProjectDTO).countryId}" dons not exists or not active!`;
  }
}
