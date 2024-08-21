import { Icon } from "@iconify/react/dist/iconify.js";
import { PlaylistDisplayProps } from "./playlist-display.types";
import usePLaylistDisplayUnit from "./usePlaylistDisplayUnit";

export default function PlaylistsDisplay(props: PlaylistDisplayProps) {
  const hook = usePLaylistDisplayUnit(props);

  if (!props.playlists) {
    return "Nothing for you!";
  }

  return (
    <div className="bg-gray-900 bg-opacity-65 p-6 rounded-lg shadow-lg h-[80vh] overflow-y-auto ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
        <div className="flex gap-4">
          <button
            onClick={hook.toggleAllPlaylists}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl transition duration-300"
          >
            {hook.selectedPlaylists.size === props.playlists.items.length
              ? "Deselect All"
              : "Select All"}
          </button>
          <button
            onClick={hook.handleBackup}
            disabled={hook.selectedPlaylists.size === 0}
            className={`${
              hook.selectedPlaylists.size === 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-semibold py-2 px-4 rounded-2xl transition duration-300`}
          >
            Backup Selected
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {props.playlists.items.map((playlist) => (
          <div
            key={playlist.id}
            className={` rounded-lg overflow-hidden shadow-md cursor-pointer ${
              hook.selectedPlaylists.has(playlist.id)
                ? "ring-2 ring-green-500  bg-transparent"
                : "transition-transform duration-300 hover:scale-105 bg-gray-800"
            }`}
            onClick={() => hook.togglePlaylist(playlist.id)}
          >
            <div className="relative">
              <img
                src={playlist.images[0]?.url || "/api/placeholder/300/300"}
                alt={`${playlist.name} cover`}
                className="w-full h-48 object-cover"
              />
              {hook.selectedPlaylists.has(playlist.id) && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Icon
                    icon="mdi:check"
                    className="text-white"
                    width="20"
                    height="20"
                  />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white truncate">
                {playlist.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1 truncate">
                {playlist.description || "No description"}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-300 flex items-center">
                  <Icon icon="mdi:music-note" className="mr-1" />
                  {playlist.tracks.total} tracks
                </span>
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon icon="mdi:spotify" width="24" height="24" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
