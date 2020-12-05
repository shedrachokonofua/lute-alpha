import { promises as fs } from "fs";
import { EitherAsync } from "purify-ts";

export const buildStub = <T>(overrides: Partial<T>): T => {
  const stub = {} as T;
  Object.entries(overrides).forEach(([key, value]) => {
    stub[key as keyof T] = value as T[keyof T];
  });
  return stub;
};

export const readFile = (fileName: string): EitherAsync<Error, string> =>
  EitherAsync<Error, string>(() => fs.readFile(fileName, "utf-8")).mapLeft(
    (error) => new Error(`Failed to read file: ${error.message}`)
  );
