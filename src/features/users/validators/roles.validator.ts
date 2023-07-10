/* eslint-disable no-restricted-syntax */
import { ValidatorConstraint } from 'class-validator';
import { IRole, Role } from '../../roles';

@ValidatorConstraint({ async: true })
export class IsRolesValid {
  async validate(roles: string[]): Promise<boolean> {
    for (const id of roles) {
      // eslint-disable-next-line no-await-in-loop
      const role: IRole | null = await Role.findById({
        _id: id,
      });
      if (!(role && role.isActivated)) return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage() {
    return `invalid roles or not active ones!`;
  }
}
