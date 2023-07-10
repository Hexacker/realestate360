import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDate,
  IsMongoId,
  Validate,
  IsOptional,
} from 'class-validator';
import { IsUserValid } from '../validators/user.validator';
import { IsClientValid } from '../validators/client.validator';
import { IsSaleValid } from '../validators/sale.validator';
import { IsBankAccountValid } from '../validators/bankAccount.validator';

class PaymentDTO {

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  recurringPaymentDay: number;

  @IsOptional()
  @IsBoolean()
  isActivated?: boolean;

  @IsBoolean()
  isPaid?: boolean;

  @IsNotEmpty()
  @IsString()
  receiptFile: string;

  @IsNotEmpty()
  @IsDate()
  receiptDate: Date;

  @IsNotEmpty()
  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsUserValid)
  lastUpdatedBy: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsClientValid)
  clientId: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsSaleValid)
  saleId: string;

  @IsNotEmpty()
  @IsMongoId()
  @Validate(IsBankAccountValid)
  bankAccountId: string;
}

export default PaymentDTO;
