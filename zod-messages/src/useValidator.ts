'use client';

import { useCallback, useMemo, useState } from 'react';

import { ZodError, ZodObject, ZodRawShape } from 'zod';
import {formatErrorMessages} from "./formatErrorMessages";

export enum eGlobalErrorMessage {
  globalErrorMessage = 'globalErrorMessage',
}

export type ValidatorMessages<T> = Partial<{
  [K in keyof T]: T[K] extends object | undefined
    ? ValidatorMessages<T[K]>
    : string;
}> & { globalErrorMessage?: string };

export interface ValidationResult<T> {
  id?: string;
  isInvalid: boolean;
  validationMessages: ValidatorMessages<T>;
}

export const initialValidationResult = <T>(): ValidationResult<T> => ({
  isInvalid: false,
  validationMessages: {} as ValidatorMessages<T>,
});

export interface ValidationItemResult {
  isInvalid: boolean;
  validationMessage?: string;
}

export interface IValidatorResult<T> {
  validate: (data: T, silent?: boolean) => ValidationResult<T>;
  validItem: (key: keyof T, value: T[keyof T]) => ValidationItemResult;
  validationMessages: ValidatorMessages<T>;
}
export const useValidator = <T extends object>(
  schema: ZodObject<ZodRawShape>,
): IValidatorResult<T> => {
  const [errorMessages, setErrorMessages] = useState<ValidatorMessages<T>>(
    {} as ValidatorMessages<T>,
  );

  const validItem = useCallback(
    (key: keyof T, value: T[keyof T]): ValidationItemResult => {
      const childSchema = schema.shape[key as keyof ZodRawShape];
      const result = childSchema.safeParse(value);

      if (!result.success) {
        const formattedErrors = formatErrorMessages<string>(result.error);
        const message = formattedErrors.globalErrorMessage ?? undefined;

        setErrorMessages((prev) => ({ ...prev, [key]: message }));

        return { isInvalid: true, validationMessage: message };
      }

      setErrorMessages((msgPrevState) => ({
        ...msgPrevState,
        [key]: undefined,
      }));

      return { isInvalid: false, validationMessage: undefined };
    },
    [schema.shape],
  );

  const validate = useCallback(
    (data: T, silent?: boolean): ValidationResult<T> => {
      try {
        schema.parse(data);
        setErrorMessages({} as ValidatorMessages<T>);
      } catch (error) {
        if (silent) return { isInvalid: true, validationMessages: {} };
        if (error instanceof ZodError) {
          const objResult = formatErrorMessages<T>(error);

          setErrorMessages(objResult);
          return { isInvalid: true, validationMessages: objResult };
        }
      }
      return { isInvalid: false, validationMessages: {} };
    },
    [schema],
  );

  return useMemo(
    () => ({
      validate,
      validationMessages: errorMessages,
      validItem,
    }),
    [validate, errorMessages, validItem],
  );
};
