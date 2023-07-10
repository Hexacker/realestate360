import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsUserEmailExists } from '../../users/validators/email.validator';
import { CheckPassword } from '../../users/validators/password.validator';

export class CompanyAdminDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Validate(IsUserEmailExists, {
    message: 'Email is already used',
  })
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
  isActivated?: boolean; // true by default
}

export default CompanyAdminDTO;
