import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsUUID,
  IsEnum,
  IsMongoId,
  Validate,
  IsOptional,
  IsNotEmptyObject,
} from 'class-validator';
import Perimeter from '../../../helpers/perimeter.class';
import { ProductStatus } from '../enum/status.enum';
import { IsGroupIdValid } from '../validators/group.validator';
import { InstanceOf } from '../../../shared/instanceOf.validation';

class ProductDTO {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @IsNotEmpty()
  @IsNumber()
  areaTotal: number;

  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsNotEmpty()
  @IsString()
  attachment: string;

  @IsNotEmptyObject()
  @InstanceOf(Perimeter, {
    message: `code should be in forma of { north: string; south: string;; east: string;west: string }`,
  })
  perimeter: Perimeter;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsGroupIdValid)
  groupId: string;
}

export default ProductDTO;
