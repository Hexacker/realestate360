import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Validate } from 'class-validator';
import { IsCompanyIdValid } from '../../clients/validators/company.validator';

class PaymentPlanDTO {
  @IsNotEmpty()
  @IsBoolean()
  isCredit: boolean;

  @IsNotEmpty()
  @IsNumber()
  downPayment: number;

  @IsNotEmpty()
  @IsNumber()
  finalPayment: number;

  @IsNotEmpty()
  @IsNumber()
  frequency: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  interestRate: number;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsCompanyIdValid)
  companyId: string;
}

export default PaymentPlanDTO;
