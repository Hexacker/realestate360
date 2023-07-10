import { IsNumber, IsNotEmpty, IsBoolean, IsOptional, IsMongoId, Validate } from 'class-validator';
import { IsUserValid } from '../../quotes/validators/user.validator';
import { IsPaymentPlanValid } from '../validators/paymentPlan.validator';
import { IsProductValid } from '../../quotes/validators/product.validator';
import { IsClientValid } from '../validators/client.validator';

class SaleDTO {
  @IsNotEmpty()
  @IsNumber()
  recurringPaymentDay: number;

  @IsNotEmpty()
  @IsNumber()
  finalPrice: number;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsUserValid)
  soldBy: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsProductValid)
  productId: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsPaymentPlanValid)
  paymentPlanId: string;


  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsClientValid)
  clientId: string;

}

export default SaleDTO;
