import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private loopError(errors: ValidationError[]) {
    const showArr: string[] = [];
    errors.map(item => {
      if (item.children && item.children.length > 0) {
        const childrenArr = this.loopError(item.children);
        showArr.push(...childrenArr);
      }
      const constraints = Object.values(item.constraints);
      showArr.push(...constraints);
    });

    return showArr;
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const showErrors = this.loopError(errors);
      throw new BadRequestException(showErrors.join(', '));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
