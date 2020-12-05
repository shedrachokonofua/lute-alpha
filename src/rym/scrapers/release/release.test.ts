import { Right } from "purify-ts";
import { buildStub, readFile } from "../../../helpers/tests";
import { RYMBrowser } from "../../browser";
import { RYMReleaseScraper } from "./release";

describe("RYMReleaseScraper", () => {
  it("should return valid result", async () => {
    const releaseHref = "/release/album/mike/weight-of-the-world/";

    const requestMock = jest
      .fn()
      .mockReturnValueOnce(readFile(__dirname + "/fixtures/release.html"));
    const browserStub = buildStub<RYMBrowser>({
      request: requestMock,
    });
    const scraper = new RYMReleaseScraper(browserStub);

    const result = await scraper.result(releaseHref).run();

    const expected = {
      name: "Weight of the World",
      artistsBriefs: [
        {
          name: "MIKE",
          href: "/artist/mike-1",
        },
      ],
      type: "album",
      releaseDate: new Date(2020, 5, 21),
      primaryGenres: [
        "Abstract Hip Hop",
        "Experimental Hip Hop",
        "East Coast Hip Hop",
      ],
      secondaryGenres: [
        "Cloud Rap",
        "Glitch Hop",
        "Conscious Hip Hop",
        "Vaporwave",
      ],
      descriptors: [
        "sampling",
        "psychedelic",
        "lo-fi",
        "melancholic",
        "male vocals",
        "hypnotic",
        "atmospheric",
        "warm",
        "optimistic",
        "mellow",
        "surreal",
        "introspective",
        "raw",
        "apathetic",
        "deadpan",
        "lethargic",
        "bittersweet",
        "urban",
        "abstract",
        "conscious",
        "sentimental",
      ],
    };

    expect(requestMock).toHaveBeenCalledWith(releaseHref);
    expect(result).toMatchObject(Right(expected));
  });
});
