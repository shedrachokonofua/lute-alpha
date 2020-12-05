import {
  array,
  Codec,
  EitherAsync,
  exactly,
  GetType,
  nonEmptyList,
  oneOf,
} from "purify-ts";
import {
  DateFromStringFormatOf,
  NonEmptyString,
  NumberRangedIn,
} from "purify-ts-extra-codec";
import Scraper from "../scraper";
import { ArtistBriefCodec } from "../shared";

const RYMReleaseCodec = Codec.interface({
  name: NonEmptyString,
  artistsBriefs: nonEmptyList(ArtistBriefCodec),
  descriptors: array(NonEmptyString),
  type: oneOf([exactly("album"), exactly("single")]),
  primaryGenres: array(NonEmptyString),
  secondaryGenres: array(NonEmptyString),
  rating: NumberRangedIn({
    gte: 0,
    lte: 5,
  }),
  ratingCount: NumberRangedIn({ gte: 0 }),
  releaseDate: DateFromStringFormatOf("d MMMM yyyy"),
});

export type RYMRelease = GetType<typeof RYMReleaseCodec>;

export class RYMReleaseScraper extends Scraper<RYMRelease> {
  result(href: string): EitherAsync<Error, RYMRelease> {
    return this.browser.request(href).chain((html) => this.parse(html));
  }

  private parse(html: string): EitherAsync<Error, RYMRelease> {
    return EitherAsync<Error, unknown>(() =>
      this.xray(html, ".release_page", {
        name: metaSelector("name"),
        rating: metaSelector("ratingValue") + "| toNumber",
        ratingCount: metaSelector("ratingCount") + "| toNumber",
        primaryGenres: this.xray(".release_pri_genres > .genre", ["@text"]),
        secondaryGenres: this.xray(".release_sec_genres > .genre", ["@text"]),
        descriptors: this.xray(".release_descriptors > td > meta", [
          "@content | trim",
        ]),
        releaseDate: "tr:nth-of-type(3) > td | trim",
        artistsBriefs: this.xray("tr:nth-of-type(1) a.artist", [
          {
            name: "@text",
            href: "@href",
          },
        ]),
        type: "tr:nth-of-type(2) td | trim | toReleaseType",
      })
    )
      .mapLeft((error) => new Error(`Parse failed: ${error.message}`))
      .chain((rawResult) =>
        EitherAsync.liftEither(RYMReleaseCodec.decode(rawResult)).mapLeft(
          (errorMessage) => new Error(`Parse Decode failed: ${errorMessage}`)
        )
      );
  }
}

const metaSelector = (name: string) => `meta[itemprop=${name}]@content`;
