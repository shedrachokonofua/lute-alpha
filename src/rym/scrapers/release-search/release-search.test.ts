import { Right } from "purify-ts";
import { buildStub, readFile } from "../../../helpers/tests";
import { RYMBrowser } from "../../browser";
import { RYMReleaseSearchScraper } from "./release-search";

describe("RYMReleaseSearchScraper", () => {
  it("should return valid result", async () => {
    const query = "MIKE Weight of the World";

    const searchMock = jest
      .fn()
      .mockReturnValue(readFile(__dirname + "/fixtures/single-artist.html"));
    const browserStub = buildStub<RYMBrowser>({
      search: searchMock,
    });
    const scraper = new RYMReleaseSearchScraper(browserStub);

    const result = await scraper.result(query).run();

    const expected = {
      artistsBriefs: [
        {
          name: "MIKE",
          href: "/artist/mike-1",
        },
      ],
      releaseName: "Weight of the World",
      releaseHref: "/release/album/mike/weight-of-the-world/",
    };

    expect(searchMock).toHaveBeenCalledWith("release", query);
    expect(result).toMatchObject(Right(expected));
  });

  it("should return valid result for releases with multiple artists", async () => {
    const query = "Watch the Throne";

    const searchMock = jest
      .fn()
      .mockReturnValue(readFile(__dirname + "/fixtures/multiple-artists.html"));
    const browserStub = buildStub<RYMBrowser>({
      search: searchMock,
    });
    const scraper = new RYMReleaseSearchScraper(browserStub);
    const result = await scraper.result(query).run();

    const expected = {
      artistsBriefs: [
        {
          name: "JAY Z",
          href: "/artist/jay-z",
        },
        {
          name: "Kanye West",
          href: "/artist/kanye-west",
        },
      ],
      releaseName: "Watch the Throne",
      releaseHref: "/release/album/jay-z-kanye-west/watch-the-throne/",
    };

    expect(searchMock).toHaveBeenCalledWith("release", query);
    expect(result).toMatchObject(Right(expected));
  });
});
