import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsMongoId,
  Validate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { IsCompanyIdValid } from '../validators/company.validator';

class ClientDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  source: string;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCompanyIdValid)
  companyId: string;
}

export default ClientDTO;
