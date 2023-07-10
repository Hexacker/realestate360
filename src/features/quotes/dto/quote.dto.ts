import {
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsMongoId,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsProductValid } from '../validators/product.validator';
import { IsUserValid } from '../validators/user.validator';
import { IsPaymentPlanValid } from '../validators/paymentPlan.validator';

class QuoteDTO {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsUserValid)
  createdBy: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsProductValid)
  productId: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsPaymentPlanValid)
  paymentPlanId: string;
}

export default QuoteDTO;
