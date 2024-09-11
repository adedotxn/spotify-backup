import { Icon } from "@iconify/react/dist/iconify.js";
import { SpotifyPlaylist } from "../../../types";

interface SinglePlaylistDisplayProps {
  playlist: SpotifyPlaylist;
  handleBackup: () => Promise<void>;
  isBackingUp: boolean;
}

export default function SinglePlaylistDisplay(
  props: SinglePlaylistDisplayProps,
) {
  return (
    <div className="bg-gray-900 bg-opacity-65 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src={props.playlist.images[0]?.url || "/api/placeholder/300/300"}
          alt={`${props.playlist.name} cover`}
          className="w-48 h-48 object-cover rounded-lg"
        />
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-white mb-2">
            {props.playlist.name}
          </h1>
          <p className="text-gray-300 mb-4">
            {props.playlist.description || "No description"}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center">
              <Icon icon="mdi:account" className="mr-1" />
              {props.playlist.owner.display_name}
            </span>
            <span className="flex items-center">
              <Icon icon="mdi:music-note" className="mr-1" />
              {props.playlist.tracks.total} tracks
            </span>
            <span className="flex items-center">
              <Icon icon="mdi:account-group" className="mr-1" />
              {props.playlist.followers.total} followers
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Tracks</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {props.playlist.tracks.items.map((item, index) => (
            <div
              key={item.track.id}
              className="flex items-center gap-4 text-gray-300 hover:bg-gray-800 p-2 rounded"
            >
              <span className="w-8 text-right">{index + 1}</span>
              <img
                src={
                  item.track.album.images[2]?.url || "/api/placeholder/64/64"
                }
                alt={`${item.track.name} album cover`}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-grow">
                <p className="font-semibold">{item.track.name}</p>
                <p className="text-sm text-gray-400">
                  {item.track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
              <span className="text-sm">
                {Math.floor(item.track.duration_ms / 60000)}:
                {String(
                  Math.floor((item.track.duration_ms % 60000) / 1000),
                ).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <a
          href={props.playlist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 flex items-center"
        >
          <Icon icon="mdi:spotify" className="mr-2" />
          Open in Spotify
        </a>
        <button
          onClick={() => {
            props.handleBackup();
          }}
          disabled={props.isBackingUp}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
        >
          {props.isBackingUp && (
            <Icon icon="mdi:loading" className="animate-spin mr-2" />
          )}
          {props.isBackingUp ? "Backing up.." : "Backup Playlst"}
        </button>
      </div>
    </div>
  );
}
