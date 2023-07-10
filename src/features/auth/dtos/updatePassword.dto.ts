import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { CheckPassword } from '../../users/validators/password.validator';

class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Validate(CheckPassword, {
    message:
      'Password should has 8 to 30 characters with at least two uppercase letters, one special case letter, two digits and three lowercase letters',
  })
  newPassword: string;
}

export default UpdatePasswordDTO;
