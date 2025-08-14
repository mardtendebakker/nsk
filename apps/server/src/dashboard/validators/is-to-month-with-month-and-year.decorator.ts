import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsToMonthWithMonthAndYear(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isToMonthWithMonthAndYear',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          // if toMonth exists but month or year is missing => invalid
          if (value && (!obj.year || obj.year === '' || !obj.month || obj.month === '')) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'toMonth requires both month and year';
        },
      },
    });
  };
}
