// import { EitherAsync } from "purify-ts";
import { getConfig } from "./config";
// import { SpotifySDK } from "./spotify";

getConfig().either(
  (error) => console.error(error),
  (config) => console.log("Config loaded:", config)
);

// EitherAsync.liftEither(getConfig())
//   .ifLeft((error) => console.error(error))
//   .ifRight((config) => console.log("Config loaded:", config))
//   .chain(({ spotifyClientId, spotifyClientSecret }) =>
//     SpotifySDK.create(spotifyClientId, spotifyClientSecret)
//   )
//   .chain(spotifySDK => EitherAsync(() => spotifySDK.test()))
//   .run()
//   .catch(console.log);
