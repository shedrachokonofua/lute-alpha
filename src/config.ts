import { Either, Codec, GetType } from "purify-ts";
import { nonEmptyString } from "./helpers/codecs";

const ConfigCodec = Codec.interface({
  spotifyClientId: nonEmptyString,
  spotifyClientSecret: nonEmptyString,
});

export type Config = GetType<typeof ConfigCodec>;

const ENV_KEY_MAP = Object.freeze({
  spotifyClientId: "SPOTIFY_CLIENT_ID",
  spotifyClientSecret: "SPOTIFY_CLIENT_SECRET",
});

const getEnvironmentVariables = (): Record<string, string> =>
  Object.entries(ENV_KEY_MAP).reduce(
    (config, [key, value]) => ({
      ...config,
      [key]: process.env[value],
    }),
    {}
  );

export const getConfig = (): Either<string, Config> =>
  ConfigCodec.decode(getEnvironmentVariables()).mapLeft(
    (message) => `Failed to load environment variables: ${message}`
  );
