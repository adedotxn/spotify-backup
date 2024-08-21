import { useState } from "react";
import { PlaylistDisplayProps } from "./playlist-display.types";

export default function usePLaylistDisplayUnit(props: PlaylistDisplayProps) {
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());

  const togglePlaylist = (playlistId: string) => {
    setSelectedPlaylists((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(playlistId)) {
        newSelected.delete(playlistId);
      } else {
        newSelected.add(playlistId);
      }
      return newSelected;
    });
  };

  const toggleAllPlaylists = () => {
    if (selectedPlaylists.size === props.playlists.items.length) {
      setSelectedPlaylists(new Set());
    } else {
      setSelectedPlaylists(
        new Set(props.playlists.items.map((playlist) => playlist.id)),
      );
    }
  };

  const handleBackup = () => {
    const playlistsToBackup = Array.from(selectedPlaylists);
    props.onBackup(playlistsToBackup);
  };

  return {
    togglePlaylist,
    toggleAllPlaylists,
    handleBackup,
    selectedPlaylists,
  };
}
