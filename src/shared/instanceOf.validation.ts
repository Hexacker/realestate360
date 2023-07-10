/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  registerDecorator,
  ValidationOptions,
  ValidationError,
  validate,
} from 'class-validator';
import { plainToClass } from 'class-transformer';
import HttpException from '../exceptions/httpException';
import { HttpStatusEnum } from './Enums/httpStatus.enum';

export function InstanceOf(
  typeObj: any,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'InstanceOf',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any) {
          const errors: ValidationError[] = await validate(
            plainToClass(typeObj, value),
          );

          if (errors.length !== 0) {
            const message = errors
              .map((error: ValidationError) => Object.values(error.constraints))
              .join(', ');

            return Promise.reject(
              new HttpException(HttpStatusEnum.BAD_REQUEST, message),
            );
          }

          return errors.length === 0;
        },
      },
    });
  };
}
