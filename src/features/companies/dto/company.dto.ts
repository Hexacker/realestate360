import { IsBoolean, IsNotEmpty, IsNumber, IsString, Validate, IsOptional, IsArray, IsMongoId } from 'class-validator';
import { IsUsersValid } from '../validators/users.validator';

class CompanyDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  logoUrl: string;

  @IsNotEmpty()
  @IsNumber()
  numEmployees: number;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(IsUsersValid)
  admins: string[];
}

export default CompanyDTO;
