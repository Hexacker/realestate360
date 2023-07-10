import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export default LoginDTO;
