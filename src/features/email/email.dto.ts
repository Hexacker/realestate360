import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

class SendEmailDTO {

  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsString()
  @IsOptional()
  templateId?: string;

  @IsString()
  @IsOptional()
  dynamicTemplateData?: object;

}

export default SendEmailDTO;
