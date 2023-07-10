import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Validate,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { IsCompanyIdValid } from '../../clients/validators/company.validator';
import { IsPermissionsValid } from '../validators/permissions.validator';

class RoleDTO {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCompanyIdValid)
  companyId: string;

  @IsNotEmpty()
  @IsArray()
  @Validate(IsPermissionsValid)
  permissions: string[];
}

export default RoleDTO;
