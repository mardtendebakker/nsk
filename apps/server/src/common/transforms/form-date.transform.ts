import { TransformFnParams } from 'class-transformer';

export function formDataNumberTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === null || isNaN(value)) {
    return null;
  }

  return Number(value);
}

export function formDataStringTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === 'null') {
    return '';
  }

  return value;
}

export function formDataDateTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === null || isNaN(new Date(value).getTime())) {
    return null;
  }

  return new Date(value);
}

export function formDataBoolTransform(params: TransformFnParams) {
  const { value } = params;

  if (value === null) {
    return null;
  }

  if (value === 'false') {
    return false;
  }

  return !!value;
}
