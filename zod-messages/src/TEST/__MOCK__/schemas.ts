import { z } from 'zod';
import {eGlobalErrorMessage} from "../../useValidator";


export const zodTestAgeValidationMessage = 'age must be greater than 0';
export const zodTestNameValidationMessage = 'name is required';
export const zodTestIsAliveValidationMessage = 'User must be alive';
export const zodTestAgeOver100ValidationMessage = 'Age cannot be more than 100';

const baseSchema = {
  name: z.string().min(1, { message: zodTestNameValidationMessage }),
  age: z.number().gte(1, { message: zodTestAgeValidationMessage }),
  isAlive: z.boolean().refine((value) => value, { message: zodTestIsAliveValidationMessage }),
};

export const zodSimpleValidationSchema = z.object(baseSchema);

export const zodComplexValidationSchema = z.object({
  ...baseSchema,
  child: zodSimpleValidationSchema,
});

export const zodComplexArrayValidationSchema = z.object({
  ...baseSchema,
  children: z.array(zodComplexValidationSchema),
});

export const zodSuperRefinedValidationSchema = z.object(baseSchema)
    .superRefine((value, ctx) => {
    if (value.age > 100) {
        return ctx.addIssue({
          code: 'custom',
          path: [eGlobalErrorMessage.globalErrorMessage],
          message: zodTestAgeOver100ValidationMessage });
    }
});
