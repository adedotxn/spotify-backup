import { SPOTIFY_ACCESS_TOKEN } from "../utils/constants";
import { fetcher } from "../utils/fetcher";
import { getLocalStorage } from "../utils/localStorage";
import type { SpotifyPlaylist } from "../types"

class SpotifyService {
    clientId: string;
    clientSecret: string;


    constructor() {
        this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
        this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;
    }


    async GetAccessToken() {
        return fetcher<{
            access_token: string
            token_type: string
            expires_in: number
        }>("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "grant_type": "client_credentials",
                "client_id": this.clientId,
                "client_secret": this.clientSecret
            })
        });

    }


    async GetPlaylists(playlistId: string): Promise<SpotifyPlaylist | null> {
        const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
        if (!token || token === "") return null;

        return fetcher(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    }




}

export default new SpotifyService();