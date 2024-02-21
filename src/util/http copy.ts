export const get = async function (url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `HTTP error! Failed to fetch data! Status: ${response.status}`
    );
  }

  const data = (await response.json()) as unknown;
  return data;

  // We can use Zod library to take a look at the data and see if it matches our expected shape and to get automatic type inference
};
