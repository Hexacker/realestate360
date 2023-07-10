import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { InstanceOf } from '../../../shared/instanceOf.validation';
import CountryCode, { CountryCodeClass } from '../helpers/country.code';

class CountryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @InstanceOf(CountryCodeClass, {
    message: `code should be in forma of { alpha2: string; alpha3: string; }`,
  })
  code: CountryCode;

  @IsBoolean()
  @IsOptional()
  isActivated?: boolean;
}

export default CountryDTO;
