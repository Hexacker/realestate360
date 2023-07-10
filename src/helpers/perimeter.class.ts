import { IsNotEmpty, IsNumber } from 'class-validator';

export default class Perimeter {
  @IsNotEmpty()
  @IsNumber()
  north: number;

  @IsNotEmpty()
  @IsNumber()
  south: number;

  @IsNotEmpty()
  @IsNumber()
  east: number;

  @IsNotEmpty()
  @IsNumber()
  west: number;
}
