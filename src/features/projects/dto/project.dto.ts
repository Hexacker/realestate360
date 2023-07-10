import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsMongoId,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsCategoriesValid } from '../validators/categories.validator';
import { IsCompanyIdValid } from '../validators/company.validator';
import { IsCountryIdValid } from '../validators/country.validator';
import { IsProductsValid } from '../validators/product.validator';

class ProjectDTO {
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
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  areaTotal: number;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCountryIdValid)
  countryId: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCompanyIdValid)
  companyId: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(IsProductsValid) // isProductValid
  products?: string[];

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  @Validate(IsCategoriesValid)
  categories: string[];
}

export default ProjectDTO;
