/* eslint-disable no-restricted-syntax */
import { ValidatorConstraint } from 'class-validator';
import { IUser, User } from '../../users';

@ValidatorConstraint({ async: true })
export class IsUsersValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(usersIds: string[]) {
    for (const id of usersIds) {
      // eslint-disable-next-line no-await-in-loop
      const user: IUser | null = await User.findById({
        _id: id,
      });
      if (!(user && user.isActivated)) return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage() {
    return `invalid users or users not active!`;
  }
}
