import { Either, EitherAsync } from "purify-ts";
import Spotify, { Client } from "spotify-api.js";

const Auth = new Spotify.Auth();

export class SpotifyClient {
  private readonly client: Client;

  private constructor(client: Client) {
    this.client = client;
  }

  static async create(
    clientId: string,
    clientSecret: string
  ): Promise<Either<string, SpotifyClient>> {
    return EitherAsync<Error, string>(() =>
      Auth.get({
        client_id: clientId,
        client_secret: clientSecret,
      }).then(String)
    )
      .mapLeft((error) => `Spotify auth failed: ${error.message}`)
      .ifRight((token) => console.log(token))
      .map((token) => new Client(token))
      .map((client) => new SpotifyClient(client));
  }
}
