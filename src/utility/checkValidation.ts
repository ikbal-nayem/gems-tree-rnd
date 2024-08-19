import { COMMON_LABELS } from "@constants/common.constant";
import { IObject, notNullOrUndefined } from "@gems/utils";

const BN_EN_NUMERIC_REGEX = /^[\d\u09E6-\u09EF]+$/; // Ex: 123, '123', '১২৩'
const BN_EN_DECIMAL_NUMERIC_REGEX =
  /^(\.|[0-9\u09E6-\u09EF]+(\.[0-9\u09E6-\u09EF]+)?)$/; // Ex: 123, '12.3', '১২.৩'
const EN_SP_TEXT_REGEX = /^[A-Za-z0-9_!@#$&()\\-`.+,/"'\-\s+]+$/;

const enCheck = (val: string) => {
  return notNullOrUndefined(val)
    ? EN_SP_TEXT_REGEX.test(val)
      ? true
      : COMMON_LABELS.EN_ONLY
    : true;
};

export { BN_EN_DECIMAL_NUMERIC_REGEX, BN_EN_NUMERIC_REGEX, enCheck };

export const arraysAreEqual = (array1: IObject[], array2: IObject[]) => {
  if (array1.length !== array2.length) {
    return false;
  }

  return array1.every((value, index) => value?.id === array2[index]?.id);
};
