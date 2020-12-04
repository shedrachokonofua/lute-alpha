import { Codec, EitherAsync, GetType } from "purify-ts";
import XRay from "x-ray";
import { nonEmptyString } from "../../helpers/codecs";
import { RYMBrowser, RYM_BASE_URL } from "../browser";

const RYMReleaseSearchResultCodec = Codec.interface({
  artistName: nonEmptyString,
  artistHref: nonEmptyString,
  releaseName: nonEmptyString,
  releaseHref: nonEmptyString,
});

export type RYMReleaseSearchResult = GetType<
  typeof RYMReleaseSearchResultCodec
>;

export class RYMReleaseSearchScraper {
  private readonly browser: RYMBrowser;
  private readonly xray = XRay();

  constructor(browser: RYMBrowser) {
    this.browser = browser;
  }

  results(query: string): EitherAsync<Error, RYMReleaseSearchResult> {
    return this.browser
      .search("release", query)
      .chain((html) => this.parse(html));
  }

  private parse(html: string): EitherAsync<Error, RYMReleaseSearchResult> {
    return EitherAsync<Error, unknown[]>(() =>
      this.xray(html, ".infobox", {
        artistName: "a.artist",
        artistHref: "a.artist@href",
        releaseName: "a.searchpage",
        releaseHref: "a.searchpage@href",
      }).limit(1)
    )
      .mapLeft((error) => new Error(`Parse failed: ${error.message}`))
      .chain((rawResult) =>
        EitherAsync.liftEither(
          RYMReleaseSearchResultCodec.decode(rawResult)
        ).mapLeft(
          (errorMessage) => new Error(`Parse Decode failed: ${errorMessage}`)
        )
      )
      .map((result) => ({
        ...result,
        artistHref: `${RYM_BASE_URL}${result.artistHref}`,
        releaseHref: `${RYM_BASE_URL}${result.releaseHref}`,
      }));
  }
}
