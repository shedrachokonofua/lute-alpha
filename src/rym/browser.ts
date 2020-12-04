import axios, { AxiosResponse } from "axios";
import { EitherAsync } from "purify-ts";

export const RYM_BASE_URL = "https://rateyourmusic.com";

const buildRymUrl = (
  path: string,
  queryParameters: Record<string, string>
): string => {
  const queryString = Object.entries(queryParameters)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return `${RYM_BASE_URL}${path}?${queryString}`;
};

type RYMSearchType = "artist" | "release";

const RYMUrl = {
  search: (type: RYMSearchType, query: string) =>
    buildRymUrl("/search", {
      searchterm: query,
      searchtype: { artist: "a", release: "l" }[type],
    }),
};

export interface RYMBrowser {
  request(
    path: string,
    queryParameters: Record<string, string>
  ): EitherAsync<Error, string>;
  search(type: RYMSearchType, query: string): EitherAsync<Error, string>;
}

export class AxiosRYMBrowser implements RYMBrowser {
  request(
    path: string,
    queryParameters: Record<string, string>
  ): EitherAsync<Error, string> {
    return EitherAsync(() => axios.get(buildRymUrl(path, queryParameters)));
  }

  search(type: RYMSearchType, query: string): EitherAsync<Error, string> {
    return EitherAsync<Error, AxiosResponse<string>>(() =>
      axios.get(RYMUrl.search(type, query))
    ).map(({ data }) => data);
  }
}
