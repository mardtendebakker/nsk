import { TransformFnParams } from 'class-transformer';

export function formDataNumberTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === 'null' || isNaN(value)) {
    return null;
  }

  return value;
}

export function formDataStringTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === 'null') {
    return '';
  }

  return value;
}
