import {ValidatorMessages} from "./useValidator";
export const hasAnyValidationErrorMessage = <T>(
  result?: ValidatorMessages<T>,
): boolean => {
  if (!result) {
    return false;
  }
  return Object.values(result).some((value) => {
    if (typeof value === 'object') {
      return hasAnyValidationErrorMessage(value ?? {});
    }
    return Boolean(value);
  });
};
