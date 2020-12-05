import { Codec, GetType } from "purify-ts";
import { NonEmptyString } from "purify-ts-extra-codec";

export const ArtistBriefCodec = Codec.interface({
  name: NonEmptyString,
  href: NonEmptyString,
});

export type ArtistBrief = GetType<typeof ArtistBriefCodec>;
