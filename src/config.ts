import { Either, Codec, GetType } from "purify-ts";
import { NonEmptyString } from "purify-ts-extra-codec";

const ConfigCodec = Codec.interface({
  spotifyClientId: NonEmptyString,
  spotifyClientSecret: NonEmptyString,
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
