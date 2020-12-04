import { Left, Right, Codec } from "purify-ts";

const isNonEmptyString = (text: unknown) =>
  typeof text === "string" && text.trim() !== "";

export const nonEmptyString = Codec.custom<string>({
  decode: (value) =>
    isNonEmptyString(value)
      ? Right(value as string)
      : Left("Value must non empty string"),
  encode: (value) => value,
});
