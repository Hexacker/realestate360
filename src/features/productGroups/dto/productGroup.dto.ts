import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';

class ProductGroupDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsMongoId()
  projectId: string;

  @IsOptional()
  @IsMongoId()
  parentId?: string; // has no parent

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean; // true by default
}

export default ProductGroupDTO;
