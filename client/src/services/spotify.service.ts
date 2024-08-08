import { fetcher } from "../utils/fetcher";
import { getLocalStorage } from "../utils/localStorage";

class SpotifyService {
    clientId: string;
    clientSecret: string;


    constructor() {
        this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
        this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;
    }


    async GetAccessToken() {
        return fetcher("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "grant_type": "client_credentials",
                "client_id": "your-client-id",
                "client_secret": "your-client-secret"
            })
        });

    }


    async GetPlaylists(playlistId: string) {
        const token = getLocalStorage("spotifyToken");
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