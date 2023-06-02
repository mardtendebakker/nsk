import { TransformFnParams } from 'class-transformer';

export function formDataToNullTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === 'null' || isNaN(value)) {
    return null;
  }

  return value;
}

export function formDataToStringTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === 'null') {
    return '';
  }

  return value;
}
