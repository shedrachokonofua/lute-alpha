import { Either, EitherAsync, Just, Left } from "purify-ts";
import XRay from "x-ray";
import { RYMBrowser } from "../browser";

const eitherString = (value: unknown): Either<unknown, string> =>
  typeof value === "string" ? Just(value).toEither(value) : Left(value);

export default abstract class Scraper<TResult> {
  protected readonly browser: RYMBrowser;
  protected readonly xray = XRay({
    filters: {
      trim: (value: unknown) =>
        eitherString(value)
          .map((text) => text.trim())
          .extract(),
      toReleaseType: (value: unknown) =>
        eitherString(value)
          .map((type) => type.toLowerCase())
          .map((type) => (type === "EP" ? "album" : type))
          .extract(),
      toNumber: (value: unknown) => Number(value),
    },
  });

  constructor(browser: RYMBrowser) {
    this.browser = browser;
  }

  abstract result(...parameters: unknown[]): EitherAsync<Error, TResult>;
}
