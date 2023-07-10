/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsPermissionsValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(permissions: string[]) {
    // for (const id of permissions) {
    //   const permission: IPermission | null = await Permission.findById({
    //     _id: id,
    //   });
    //   // failed if on of them is an invalid permission id
    //   if (! (permission && permission.isActivated)) return false;
    // }
    // all ids are valid
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage() {
    return `invalid permissions or not active ones !`;
  }
}
