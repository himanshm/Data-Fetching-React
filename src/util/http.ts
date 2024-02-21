// You can adjust the get function to accept a second parameter that could be called zodSchema and should be a Zod schema object (of type ZodType). This Zod schema can then be used inside the get function to parse the received response.

import { z } from 'zod';

export const get = async function <T>(url: string, zodSchema: z.ZodType<T>) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch data.');
  }

  const data = (await response.json()) as unknown;

  try {
    return zodSchema.parse(data);
  } catch (error) {
    throw new Error('Invalid data received from server.');
  }
};

// Since Zod would throw an error if parsing the data fails, TypeScript knows that if it succeeds, the data will be a value of the type defined by the Zod schema (i.e., TypeScript will narrow the type to be of that type). Therefore, no more type casting is needed anywhere. Instead, in the place where get() should be called, you just need to define a Zod schema that describes the expected type and pass it to get().
