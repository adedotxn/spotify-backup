import { getLocalStorage } from "../utils/localStorage";

class SpotifyService {
    clientId: string;
    clientSecret: string;


    constructor() {
        this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
        this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET as string;
    }


    async GetAccessToken() {
        fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "grant_type": "client_credentials",
                "client_id": this.clientId,
                "client_secret": this.clientSecret
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error));

    }


    async GetPlaylists(playlistId: string) {
        const token = getLocalStorage("spotifyToken");
        if (!token || token === "") return null;


        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error));

    }
}

export default new SpotifyService();