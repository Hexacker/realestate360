import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Validate,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { IsCompanyExists } from '../validators/company.validator';

class BankAccountDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  typeAccount: string;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCompanyExists)
  companyId: string;
}

export default BankAccountDTO;
