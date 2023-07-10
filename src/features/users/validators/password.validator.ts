/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
export class CheckPassword {
  async validate(password: string) {
    const pwdPatern = new RegExp(
      '^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,30}$',
    );

    if (!password || typeof password !== 'string') return false;

    return !!pwdPatern.test(password);
  }

  defaultMessage() {
    const msg = `Password should has 8 to 30 characters with at least two uppercase letters, one special case letter, two digits and three lowercase letters`;
    return msg;
  }
}
