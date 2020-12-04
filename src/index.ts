// import { EitherAsync } from "purify-ts";
import { getConfig } from "./config";
// import { SpotifySDK } from "./spotify";

getConfig().either(
  (error) => console.error(error),
  (config) => console.log("Config loaded:", config)
);
