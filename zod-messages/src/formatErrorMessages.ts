import { ZodError } from 'zod';
import { eGlobalErrorMessage, ValidatorMessages }  from "./useValidator";


//
// * This function formats the error messages from zod
// * It is used in the useValidator hook
//

export const formatErrorMessages = <T>(
    errorMessages: ZodError,
): ValidatorMessages<T> => {
    let objResult: ValidatorMessages<T> = {} as ValidatorMessages<T>;

    errorMessages.errors
        .slice()
        .reverse()
        .forEach((e) => {
            if (e.path.length === 0 && !e.message) return;
            const createdObject = createObject(
                (e.path.length > 0 ? e.path : [eGlobalErrorMessage.globalErrorMessage]) as never[],
                e.message,
                objResult,
            );
            objResult = { ...objResult, ...createdObject };
        });

    return objResult;
};

export const createArray = (
    keys: (string | number)[],
    message: string,
    obj: unknown,
): object => {
    try {
        if (Array.isArray(obj)) {
            obj[+keys[0]] = createObject(keys.slice(1), message, {});
            return obj;
        }

        return Array.from({ length: +keys[0] + 1 }).map((_, index) =>
            index === +keys[0] ? createObject(keys.slice(1), message, obj) : undefined
        );
    } catch {
        return obj as object;
    }
};

export const createObject = (
    keys: (string | number)[],
    message: string,
    obj: any = {},
): object => {
    try {
        if (keys.length === 1) {
            return { ...obj, [keys[0]]: message };
        }

        const [firstKey, ...restKeys] = keys;

        if (typeof firstKey === 'number') {
            if (obj[firstKey] && !Array.isArray(obj[firstKey])) {
                obj[firstKey] = createObject(restKeys, message, obj[firstKey]);
                return obj;
            }
            return createArray(keys, message, obj);
        }

        return {
            ...obj,
            [firstKey]: createObject(restKeys, message, obj[firstKey]),
        };
    } catch (error) {
        return obj;
    }
};

