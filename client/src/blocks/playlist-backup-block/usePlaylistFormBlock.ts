import { useMemo, useState } from "react";
import { SPOTIFY_ACCESS_TOKEN } from "../../utils/constants";
import { getLocalStorage } from "../../utils/localStorage";
import useSWR from "swr";
import spotifyService from "../../services/spotify.service";
import { downloadCSV } from "../../utils/downloadCsv";

export const usePlaylistFormBlock = () => {
  const [spotifyLink, setSpotifyLink] = useState("");

  function extractPlaylistId(link: string) {
    if (link.length === 0) return "";

    const splitLink = link.split("/");
    const containsPlaylistId = splitLink[splitLink.length - 1];

    return containsPlaylistId.includes("?")
      ? containsPlaylistId.split("?")[0]
      : containsPlaylistId;
  }

  const extractedId = useMemo(
    () => extractPlaylistId(spotifyLink),
    [spotifyLink],
  );

  const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
  const hasToken = token && token !== "";

  const [shouldFetchAllPlaylists, setShouldFetchAllPlaylists] = useState(false);

  function fetchAllPlaylists() {
    setShouldFetchAllPlaylists(true);
  }

  const { data: playlists, isLoading: isPlaylistsLoading } = useSWR(
    shouldFetchAllPlaylists ? "spotifyService.GetUserPlaylists" : null,
    spotifyService.GetUserPlaylists,
  );

  console.log("PLAYLISTS", playlists);

  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = async (selectedPlaylistIds: Array<unknown>) => {
    setIsBackingUp(true);
    try {
      if (playlists && selectedPlaylistIds.length === playlists.items.length) {
        // Backup all playlists
        const backups = await spotifyService.backupAllPlaylists();
        Object.entries(backups).forEach(([name, csv]) => {
          downloadCSV(csv, `${name}_backup.csv`);
        });
      } else {
        // Backup selected playlists
        for (const playlistId of selectedPlaylistIds) {
          const { name, csv } = await spotifyService.backupPlaylist(
            playlistId as string,
          );
          downloadCSV(csv, `${name}_backup.csv`);
        }
      }
    } catch (error) {
      console.error("Error backing up playlists:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsBackingUp(false);
    }
  };

  return {
    spotifyLink,
    setSpotifyLink,
    extractedPlaylistId: extractedId,
    hasToken,
    fetchAllPlaylists,
    playlists,
    isPlaylistsLoading,
    isBackingUp,
    handleBackup,
  };
};
