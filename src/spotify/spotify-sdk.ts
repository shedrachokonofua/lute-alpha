import { Either, EitherAsync } from "purify-ts";
import Spotify, { Client } from "spotify-api.js";

const Auth = new Spotify.Auth();

export class SpotifySDK {
  private readonly client: Client;

  private constructor(client: Client) {
    this.client = client;
  }

  static async create(
    clientId: string,
    clientSecret: string
  ): Promise<Either<string, SpotifySDK>> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return EitherAsync<Error, String>(() =>
      Auth.get({
        client_id: clientId,
        client_secret: clientSecret,
      })
    )
      .mapLeft((error) => `Spotify auth failed: ${error.message}`)
      .ifRight((token) => console.log(token))
      .map((token) => new Client(String(token)))
      .map((client) => new SpotifySDK(client));
  }
}
