import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_CODE_VERIFIER,
  SPOTIFY_REFRESH_TOKEN,
} from "../utils/constants";
import { fetcher } from "../utils/fetcher";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";
import type {
  SpotifyPlaylist,
  SpotifyTokens,
  SpotifyUser,
  SpotifyUserPlaylists,
} from "../types";

class SpotifyService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
    this.redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
  }

  private generateCodeVerifier(length = 64): string {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hashed = await crypto.subtle.digest("SHA-256", data);

    return btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  async getAuthUrl(): Promise<string> {
    console.log(this.redirectUri);
    const verifier = this.generateCodeVerifier();
    const challenge = await this.generateCodeChallenge(verifier);

    // Store the code verifier to use it later
    setLocalStorage(SPOTIFY_CODE_VERIFIER, verifier);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: "code",
      redirect_uri: this.redirectUri,
      code_challenge_method: "S256",
      code_challenge: challenge,
      scope:
        "user-read-private user-read-email playlist-read-private playlist-read-collaborative",
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getTokens(code: string): Promise<void> {
    const verifier = getLocalStorage(SPOTIFY_CODE_VERIFIER);

    if (!verifier) {
      throw new Error("Code verifier not found");
    }

    const response = await fetcher<SpotifyTokens>(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: this.redirectUri,
          code_verifier: verifier,
        }),
      },
    );

    console.log("getTokensResp", response);
    if (response.access_token)
      setLocalStorage(SPOTIFY_ACCESS_TOKEN, response.access_token);
    if (response.refresh_token)
      setLocalStorage(SPOTIFY_REFRESH_TOKEN, response.refresh_token);
  }

  async refreshAccessToken(): Promise<void> {
    const refreshToken = getLocalStorage(SPOTIFY_REFRESH_TOKEN);
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetcher<SpotifyTokens>(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: this.clientId,
        }),
      },
    );

    console.log("refresh token response", response);
    if (response.access_token)
      setLocalStorage(SPOTIFY_ACCESS_TOKEN, response.access_token);
    if (response.refresh_token)
      setLocalStorage(SPOTIFY_REFRESH_TOKEN, response.refresh_token);
  }

  async getCurrentUser() {
    const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
    if (!token) throw new Error("No access token available");

    return fetcher<SpotifyUser>("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async GetUserPlaylists(): Promise<SpotifyUserPlaylists> {
    const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
    if (!token) throw new Error("No access token available");

    let playlists: SpotifyUserPlaylists = {
      href: "",
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
      items: [
        {
          collaborative: false,
          description: "",
          external_urls: { spotify: "" },
          href: "",
          id: "",
          images: [{ url: "", height: 0, width: 0 }],
          name: "",
          owner: {
            external_urls: { spotify: "" },
            followers: { href: "", total: 0 },
            href: "",
            id: "",
            type: "",
            uri: "",
            display_name: "",
          },
          public: false,
          snapshot_id: "",
          tracks: { href: "", total: 0 },
          type: "",
          uri: "",
        },
      ],
    };

    let next: string | null =
      "https://api.spotify.com/v1/me/playlists?limit=50";

    while (next) {
      const response: SpotifyUserPlaylists =
        await fetcher<SpotifyUserPlaylists>(next, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      playlists = response;
      next = response.next;
    }

    return playlists;
  }

  async GetPlaylistByID(playlistId: string): Promise<SpotifyPlaylist> {
    const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
    if (!token) throw new Error("No access token available");

    return fetcher<SpotifyPlaylist>(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  private convertToCSV(tracks: SpotifyPlaylist["tracks"]["items"]): string {
    const headers = [
      "Track Name",
      "Artist(s)",
      "Album",
      "Duration (ms)",
      "Explicit",
      "Track Number",
      "Disc Number",
      "Spotify URI",
      "Added At",
    ];

    const rows = tracks.map((item) => {
      const track = item.track;
      return [
        track.name,
        track.artists.map((artist) => artist.name).join(", "),
        track.album.name,
        track.duration_ms,
        track.explicit,
        track.track_number,
        track.disc_number,
        track.uri,
        item.added_at,
      ];
    });

    const escapeCsvValue = (value: unknown): string => {
      if (value == null) return "";
      return typeof value === "string"
        ? `"${value.replace(/"/g, '""')}"`
        : String(value);
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    return csvContent;
  }

  async backupPlaylist(
    playlistId: string,
  ): Promise<{ name: string; csv: string }> {
    const playlist = await this.GetPlaylistByID(playlistId);
    if (!playlist) throw new Error("Playlist not found");

    const tracks = await this.getPlaylistTracks(playlistId);
    const csvContent = this.convertToCSV(tracks);
    return { name: playlist.name, csv: csvContent };
  }

  async backupAllPlaylists(): Promise<{ [key: string]: string }> {
    const playlists = await this.GetUserPlaylists();
    const backups: { [key: string]: string } = {};

    for (const playlist of playlists.items) {
      const { name, csv } = await this.backupPlaylist(playlist.id);
      backups[name] = csv;
    }

    return backups;
  }

  async backupSinglePlaylist(
    playlist: SpotifyPlaylist,
  ): Promise<{ name: string; csv: string }> {
    const csvContent = this.convertToCSV(playlist.tracks.items);
    return { name: playlist.name, csv: csvContent };
  }

  private async getPlaylistTracks(
    playlistId: string,
  ): Promise<SpotifyPlaylist["tracks"]["items"]> {
    const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
    if (!token) throw new Error("No access token available");

    let tracks: SpotifyPlaylist["tracks"]["items"] = [];
    let next: string | null =
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    while (next) {
      const response: SpotifyPlaylist["tracks"] = await fetcher<
        SpotifyPlaylist["tracks"]
      >(next, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      tracks = [...tracks, ...response.items];
      next = response.next;
    }

    return tracks;
  }
}

export default new SpotifyService();
