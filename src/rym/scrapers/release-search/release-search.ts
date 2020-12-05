import { Codec, EitherAsync, GetType, nonEmptyList } from "purify-ts";
import { NonEmptyString } from "purify-ts-extra-codec";
import Scraper from "../scraper";
import { ArtistBriefCodec } from "../shared";

const RYMReleaseSearchResultCodec = Codec.interface({
  artistsBriefs: nonEmptyList(ArtistBriefCodec),
  releaseName: NonEmptyString,
  releaseHref: NonEmptyString,
});

export type RYMReleaseSearchResult = GetType<
  typeof RYMReleaseSearchResultCodec
>;

export class RYMReleaseSearchScraper extends Scraper<RYMReleaseSearchResult> {
  result(query: string): EitherAsync<Error, RYMReleaseSearchResult> {
    return this.browser
      .search("release", query)
      .chain((html) => this.parse(html));
  }

  private parse(html: string): EitherAsync<Error, RYMReleaseSearchResult> {
    return EitherAsync<Error, unknown[]>(() =>
      this.xray(html, ".infobox", [
        {
          artistsBriefs: this.xray(".artist", [
            {
              name: "@text",
              href: "@href",
            },
          ]),
          releaseName: "a.searchpage",
          releaseHref: "a.searchpage@href",
        },
      ])
    )
      .mapLeft((error) => new Error(`Parse failed: ${error.message}`))
      .chain((rawResult) =>
        EitherAsync.liftEither(
          RYMReleaseSearchResultCodec.decode(rawResult[0])
        ).mapLeft(
          (errorMessage) => new Error(`Parse Decode failed: ${errorMessage}`)
        )
      );
  }
}
