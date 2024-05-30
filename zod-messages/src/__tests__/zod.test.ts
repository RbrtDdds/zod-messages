import {
    zodComplexArrayValidationSchema,
    zodComplexValidationSchema,
    zodSimpleValidationSchema, zodSuperRefinedValidationSchema, zodTestAgeOver100ValidationMessage,
    zodTestAgeValidationMessage, zodTestIsAliveValidationMessage,
    zodTestNameValidationMessage,
} from "./__MOCK__/schemas";
import { formatErrorMessages } from "../formatErrorMessages";
import { zodTestComplexArrayData, zodTestComplexData, zodTestSimpleData } from "./__MOCK__/data";
import {
    IZodTestValidatorObjectComplex,
    IZodTestValidatorObjectComplexArray,
    IZodTestValidatorObjectSimple
} from "./__MOCK__/model";
import {eGlobalErrorMessage, useValidator, ValidationItemResult, ValidationResult} from "../useValidator";
import { act, cleanup, renderHook } from "@testing-library/react";


describe('zodValidator', () => {
    afterEach(cleanup);
    it('should correct map message from model', () => {
        const result = zodSimpleValidationSchema.safeParse(zodTestSimpleData);

        expect(result.success).toBe(false);
        if(!result.success) {
            const validationMessages = formatErrorMessages<IZodTestValidatorObjectSimple>(result.error);
            expect(validationMessages.name).toBe(zodTestNameValidationMessage);
            expect(validationMessages?.age).toBe(zodTestAgeValidationMessage);
            expect(validationMessages?.isAlive).toBe(zodTestIsAliveValidationMessage);
        }
    });
    it('should correct map message from complex model', () => {
        const result = zodComplexValidationSchema.safeParse(zodTestComplexData);

        expect(result.success).toBe(false);
        if(!result.success) {
            const validationMessages = formatErrorMessages<IZodTestValidatorObjectComplex>(result.error);

            expect(validationMessages.child?.name).toBe(zodTestNameValidationMessage);
            expect(validationMessages.child?.age).toBe(zodTestAgeValidationMessage);
        }
    });
    it('should correct map message from complex Array model', () => {
        const result = zodComplexArrayValidationSchema.safeParse(zodTestComplexArrayData);

        expect(result.success).toBe(false);
        if(!result.success) {
            const validationMessages = formatErrorMessages<IZodTestValidatorObjectComplexArray>(result.error);

            expect(validationMessages.name).toBe(zodTestNameValidationMessage);
            expect(validationMessages?.children?.[0]?.name).toBe(zodTestNameValidationMessage);
            expect(validationMessages.children?.[0]?.child?.name).toBe(zodTestNameValidationMessage);


            expect(validationMessages.children?.[1]).toBe(undefined);


            expect(validationMessages?.children?.[2]?.name).toBe(undefined);
            expect(validationMessages?.children?.[2]?.child?.age).toBe(zodTestAgeValidationMessage);
        }

    });

    it('should correct show globalErrorMessage for invalid age over 100', () => {
        const result = zodSuperRefinedValidationSchema.safeParse({name: 'Name 1', age: 101, isAlive: true});

        expect(result.success).toBe(false);

        if(!result.success) {
            const validationMessages = formatErrorMessages(result.error);

            expect(validationMessages[eGlobalErrorMessage.globalErrorMessage]).toBe(zodTestAgeOver100ValidationMessage);
        }
    });

    it('should correct valid with useValidator and validate item', () => {
        const { result: hookResult } = renderHook(() => useValidator<IZodTestValidatorObjectSimple>(zodSimpleValidationSchema));

        let result: ValidationResult<IZodTestValidatorObjectSimple> = { isInvalid: false, validationMessages: {} };
        act(() => { result = hookResult.current.validate(zodTestSimpleData)});

        expect(result.isInvalid).toBe(true);
        expect(result.validationMessages.name).toBe(zodTestNameValidationMessage);

        const zodTestSimpleData2 = { ...zodTestSimpleData, name: 'Name 1' };

        let result2: ValidationItemResult = { isInvalid: false, validationMessage: result.validationMessages.name };

        act(() => { result2 = hookResult.current.validItem('name', zodTestSimpleData2.name)});

        expect(result2.isInvalid).toBe(false);
        expect(result2.validationMessage).toBe(undefined);
    });

})