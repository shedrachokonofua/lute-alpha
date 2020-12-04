import { EitherAsync, Right } from "purify-ts";
import { promises as fs } from "fs";
import { buildStub } from "../../helpers/tests";
import { RYMBrowser } from "../browser";
import {
  RYMReleaseSearchScraper,
  RYMReleaseSearchResult,
} from "./release-search";

const readFile = (fileName: string) =>
  EitherAsync<Error, string>(() => fs.readFile(fileName, "utf-8")).mapLeft(
    (error) => new Error(`Failed to read file: ${error.message}`)
  );

describe("RYMReleaseSearchScraper", () => {
  it("should return valid result", async () => {
    const searchMock = jest
      .fn()
      .mockReturnValue(readFile(__dirname + "/fixtures/release-search.html"));
    const browserStub = buildStub<RYMBrowser>({
      search: searchMock,
    });
    const scraper = new RYMReleaseSearchScraper(browserStub);
    const result = await scraper.results("MIKE Weight of the World").run();

    const expected: RYMReleaseSearchResult = {
      artistName: "MIKE",
      artistHref: "https://rateyourmusic.com/artist/mike-1",
      releaseName: "Weight of the World",
      releaseHref:
        "https://rateyourmusic.com/release/album/mike/weight-of-the-world/",
    };

    expect(searchMock).toHaveBeenCalledWith(
      "release",
      "MIKE Weight of the World"
    );
    expect(result).toMatchObject(Right(expected));
  });
});
