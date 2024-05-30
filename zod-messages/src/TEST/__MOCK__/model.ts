export interface IZodTestValidatorObjectSimple {
  name: string;
  age: number;
  isAlive: boolean;
}

export interface IZodTestValidatorObjectComplex {
  name: string;
  age: number;
  isAlive: boolean;
  child: IZodTestValidatorObjectSimple;
}

export interface IZodTestValidatorObjectComplexArray {
  name: string;
  age: number;
  isAlive: boolean;
  children: IZodTestValidatorObjectComplex[];
}
