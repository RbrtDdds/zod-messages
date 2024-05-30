import {
  IZodTestValidatorObjectComplex,
  IZodTestValidatorObjectComplexArray,
  IZodTestValidatorObjectSimple,
} from './model';

export const zodTestSimpleData: IZodTestValidatorObjectSimple = {
  name: '',
  age: 0,
  isAlive: false,
};

export const zodTestSimpleDataCorrect: IZodTestValidatorObjectSimple = {
  name: 'Name 11',
  age: 20,
  isAlive: true,
};

export const zodTestComplexData: IZodTestValidatorObjectComplex = {
  ...zodTestSimpleData,
  child: zodTestSimpleData,
};

export const zodTestComplexArrayData: IZodTestValidatorObjectComplexArray = {
  ...zodTestSimpleData,
  children: [
    zodTestComplexData,
    { ...zodTestSimpleDataCorrect, child: zodTestSimpleDataCorrect },
    {
      age: 0,
      name: 'Name 2',
      isAlive: true,
      child: { name: 'Name 3', age: -2, isAlive: true },
    },
  ],
};
