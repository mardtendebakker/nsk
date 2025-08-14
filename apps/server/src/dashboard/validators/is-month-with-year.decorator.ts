import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsMonthWithYear(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isMonthWithYear',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          // if month exists but year is missing => invalid
          if (value && (!obj.year || obj.year === '')) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Month requires a year';
        },
      },
    });
  };
}