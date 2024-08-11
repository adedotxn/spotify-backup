import { useState } from "react";
import spotifyService from "../../services/spotify.service";
import { SPOTIFY_ACCESS_TOKEN } from "../../utils/constants";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";

export const usePlaylistFormBlock = () => {
    const [spotifyLink, setSpotifyLink] = useState("");

    const extractPlaylistId = (link: string) => {
        if (link.length === 0) return "";

        const splitLink = link.split("/");

        const conatinsPlaylistId = splitLink[splitLink.length - 1];

        const playlistId = conatinsPlaylistId.includes("?")
            ? conatinsPlaylistId.split("?")[0]
            : conatinsPlaylistId;

        return playlistId;
    };

    async function getAccessToken() {
        try {
            const getToken = await spotifyService.GetAccessToken();
            console.log(getToken);
            setLocalStorage(SPOTIFY_ACCESS_TOKEN, getToken.access_token);
        } catch (error) {
            console.error(error);
        }
    }

    const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
    const hasToken = token && token !== "";

    async function getPlaylist() {
        if (!hasToken) getAccessToken();

        const playlistId = extractPlaylistId(spotifyLink);
        if (playlistId === "") return;
        try {
            const playlist = await spotifyService.GetPlaylists(playlistId);
            console.log(playlist);
        } catch (error) {
            console.error(error);
        }
    }

    return {
        spotifyLink,
        setSpotifyLink,
        extractPlaylistId,
        getAccessToken,
        hasToken,
        getPlaylist
    };
}