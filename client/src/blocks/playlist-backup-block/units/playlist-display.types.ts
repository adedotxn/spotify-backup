import { SpotifyUserPlaylists } from "../../../types";

export interface PlaylistDisplayProps {
  playlists: SpotifyUserPlaylists;
  onBackup: (selectedPlaylistIds: Array<unknown>) => Promise<void>;
}
