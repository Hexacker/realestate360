import { Validate } from 'class-validator';
import { CheckPassword } from '../../users/validators/password.validator';

class ResetPasswordDTO {
  @Validate(CheckPassword, {
    message:
      'Password should has 8 to 30 characters with at least two uppercase letters, one special case letter, two digits and three lowercase letters',
  })
  newPassword: string;
}

export default ResetPasswordDTO;
