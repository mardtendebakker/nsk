import { useEffect, useState } from 'react';

export type SetValue = (payload: FieldPayload) => void;

const getError = (field: Field, data: FormRepresentation): string | undefined => {
  switch (true) {
    case field.required && !field.value:
      return field.requiredMessage || 'required field';
    case typeof field.validator === 'function':
      return field.validator(data);
    default:
      return undefined;
  }
};

const useForm = (formRepresentation: FormRepresentation) : {
  formRepresentation: FormRepresentation,
  setValue: SetValue,
  setError: (payload: FieldErrorPayload) => void,
  validate: () => boolean,
} => {
  const [data, setData] = useState<FormRepresentation>(formRepresentation);

  useEffect(() => {
    if (formRepresentation) {
      setData(formRepresentation);
    }}, [JSON.stringify(formRepresentation)]);

  return {
    formRepresentation: data,
    setValue: ({ field, value }: FieldPayload): void => {
      setData((oldData: FormRepresentation) => ({
        ...oldData,
        [field]: {
          ...data[field],
          value,
        },
      }));
    },
    setError: ({ field, error }: FieldErrorPayload) :void => {
      setData((oldData: FormRepresentation) => ({
        ...oldData,
        [field]: {
          ...data[field],
          error,
        },
      }));
    },
    validate: () : boolean => {
      let hasError = false;

      Object.keys(data).forEach((key) => {
        const error = getError(data[key], data);
        if (error) {
          hasError = true;
        }

        setData((oldData: FormRepresentation) => ({
          ...oldData,
          [key]: {
            ...data[key],
            error,
          },
        }));
      });

      return hasError;
    },
  };
};

export default useForm;

export interface Field {
  value: string | number | boolean;
  validator?: (formRepresentation: FormRepresentation) => string | undefined | null;
  required?: boolean;
  requiredMessage?: string;
  error?: string;
}

export interface FormRepresentation {
  [key: string]: Field;
}

export interface FieldPayload {
  field: string;
  value: string | number | boolean;
}

interface FieldErrorPayload {
  field: string;
  error: string;
}
