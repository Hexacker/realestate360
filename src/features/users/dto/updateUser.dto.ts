import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
  IsOptional,
} from 'class-validator';
import { CheckPassword } from '../validators/password.validator';

class UpdateUserDTO {

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Validate(CheckPassword, {
    message:
      'Password should has 8 to 30 characters with at least two uppercase letters, one special case letter, two digits and three lowercase letters',
  })
  password: string;

  @IsOptional()
  profilePicture?: any;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsOptional()
  @IsArray()
  roles?: string[];
}

export default UpdateUserDTO;
