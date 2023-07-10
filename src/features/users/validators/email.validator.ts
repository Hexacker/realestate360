/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ValidatorConstraint } from 'class-validator';
import { IUser, User } from '..';

@ValidatorConstraint({ async: true })
export class IsUserEmailExists {
  async validate(email: string) {
    const user: IUser | null = await User.findOne({ email });

    return !user;
  }

  defaultMessage() {
    return `Email already used`;
  }
}
