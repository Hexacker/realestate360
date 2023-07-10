import { IsNotEmpty, IsString } from "class-validator";

export default interface CountryCode{
    alpha2: string;
    alpha3: string;
}
export class CountryCodeClass implements CountryCode{
    @IsNotEmpty()
    @IsString()
    alpha2: string;

    @IsNotEmpty()
    @IsString()
    alpha3: string;
}
