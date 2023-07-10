import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

import CompanyAdminDTO from './company.admin.dto';

import { InstanceOf } from '../../../shared/instanceOf.validation';

class CompanyRegisterDTO {
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

  @InstanceOf(CompanyAdminDTO)
  admin: CompanyAdminDTO;
}

export default CompanyRegisterDTO;
