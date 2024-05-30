# Zod Messages

Zod Messages is a TypeScript project that provides a set of utilities for handling validation messages using the [Zod](https://github.com/colinhacks/zod) library. This library allows you to easily validate your data and display error messages in a readable form within your components.

## Features

- **Easy Integration**: Seamlessly integrates with the Zod validation library.
- **Readable Messages**: Transforms Zod error results into user-friendly validation messages.
- **TypeScript Support**: Fully typed and compatible with TypeScript.
- **Flexible**: Can be used in various JavaScript frameworks and environments.



## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Zod Messages.

```bash
npm install zod-messages
```

## Usage with hooks

```typescript
import { useValidator } from 'zod-messages';

// your code here
```

### Simple Example useValidator


```typescript
// model.ts
export interface User {
  name: string;
  email: string;
  age: number;
  address : {
    street: string;
    city: string;
  }
}
```

```typescript
// schema.ts
import { z } from 'zod';


export const UserValidationSchema = z.object({
    name: z.string().min(3),
    email: z.string().email({ message: 'Invalid email address' }),
    age: z.number().min(15, { message: 'Age must be at least 15' }),
    address: addressSchema,
});

export const AddressValidationSchema = z.object({
    street: z.string().min(3),
    city: z.string().min(3),
});
```

```tsx
// index.tsx

import { useValidator } from 'zod-messages';
import { ErrorMessage } from '@your-components/errorMessage/index';

export const YourComponent = () => {

    const { validate, validationMessages } = useValidator<User>(UserValidationSchema);

    const handleSubmit = (data: User) => {
        const result = validate(data);
        if (result.success) {
            // do something
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" />
            <ErrorMessage message={validationMessages.name} />
            
            <input type="text" name="email" />
            <ErrorMessage message={validationMessages.email} />

            <input type="number" name="age" />
            <ErrorMessage message={validationMessages.age} /> //Age must be at least 15
            
            <input type="text" name="address.street" />
            <ErrorMessage message={validationMessages.address.street} />
            
            <input type="text" name="address.city" />
            <ErrorMessage message={validationMessages.address.city} />
            
            <button type="submit">Submit</button>
        </form>
    );
}
```

### Example for use formatErrorMessages

```typescript
//validation.ts

import { ValidationResult } from "./useValidator";

export const isUserValid = <T extends User>(data?: T): ValidationResult<T> => {
    const result = UserValidationSchema.safeParse(data ?? initUserData);

    return {
        isInvalid: !result.success,
        validationMessages: result.success ? {} : formatErrorMessages<T>(result.error),
    }
};

//result
// {
//     isInvalid: false,
//     validationMessages: {
//         name: 'Name is required',
//         email: 'Invalid email address',
//         age: 'Age must be at least 15',
//         address: {
//             street: 'Street is required',
//             city: undefined
//         }
//     }
// }

```

### Advanced example - use custom error messages

```typescript
import { z } from 'zod';


export const UserValidationSchema = z.object({
    name: z.string().min(3),
    email: z.string().email({ message: 'Invalid email address' }),
    address: addressSchema,
})
    .superRefine((data, ctx) => {
    if (data.address.city === 'New York') {
        return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['address', 'city'],
            message: 'City cannot be New York',
        });
    }
})
```

### or for use global error message

```typescript
import {z} from 'zod';
import {eGlobalErrorMessage} from "./useValidator";


export const UserValidationSchema = z.object({
    name: z.string().min(3),
    email: z.string().email({message: 'Invalid email address'}),
})
    .superRefine((data, ctx) => {
    const diacritics = /[\u0300-\u036f]/g;
    
    if (diacritics.test(data.name)) {
        return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [eGlobalErrorMessage.globalErrorMessage],
            message: 'Name cannot contain diacritics',
        });
    }
})
```

```tsx
// index.tsx
//...
return (
    <form onSubmit={handleSubmit}>
        <input type="text" name="name" />
        <ErrorMessage message={validationMessages.name ?? validationMessages.globalErrorMessage} />
    </form>);
//...
```




## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the [ISC](https://choosealicense.com/licenses/isc/) License - see the LICENSE file for details.