import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsMongoId, Validate  } from 'class-validator';
import { IsCompanyIdValid } from '../../clients/validators/company.validator';

class ProjectCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCompanyIdValid)
  companyId: string;

  @IsBoolean()
  @IsOptional()
  isActivated?: boolean;
}

export default ProjectCategoryDTO;
