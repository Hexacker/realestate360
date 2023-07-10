import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { UsersService } from '../../users';
import SaleDTO from '../dto/sale.dto';

@ValidatorConstraint({ async: true })
export class IsUserValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(userId: string) {
    const userFound = await UsersService.getUser(userId);
    return !!(userFound && userFound.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `user with _id: "${
      (args.object as SaleDTO).soldBy
    }" does not exist or not active!`;
  }
}
