import { EitherAsync } from "purify-ts";
import { AxiosRYMBrowser } from "./browser";
import {
  RYMRelease,
  RYMReleaseScraper,
  RYMReleaseSearchScraper,
} from "./scrapers";

export class RYMClient {
  private releaseScraper: RYMReleaseScraper;
  private releaseSearchScraper: RYMReleaseSearchScraper;

  constructor() {
    const browser = new AxiosRYMBrowser();
    this.releaseScraper = new RYMReleaseScraper(browser);
    this.releaseSearchScraper = new RYMReleaseSearchScraper(browser);
  }

  release(query: string): EitherAsync<Error, RYMRelease> {
    return this.releaseSearchScraper
      .result(query)
      .ifRight(console.log)
      .chain(({ releaseHref }) => this.releaseScraper.result(releaseHref));
  }
}
