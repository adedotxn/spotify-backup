import { Icon } from "@iconify/react/dist/iconify.js";
import { usePlaylistFormBlock } from "./usePlaylistFormBlock";
import PlaylistsDisplay from "./units/playlist-display";
import LoginBlock from "../login-block/LoginBlock";
import SinglePlaylistDisplay from "./units/single-playlist-display";

export default function PlaylistFormBlock() {
  const hook = usePlaylistFormBlock();

  return (
    <section className="md:px-12 grid md:grid-cols-2 gap-2 ">
      <div className="">
        <LoginBlock />
        <div className="my-3">
          {" "}
          <h2 className="font-bold text-xl">
            Get all your playlists at once
          </h2>{" "}
          <button
            type="button"
            onClick={hook.fetchAllPlaylists}
            className="text-white bg-gray-500 w-fit rounded-md my-2 py-1 px-2 font-semibold flex items-center gap-1"
          >
            <Icon icon="ic:round-downloading" width={20} height={20} />
            <span> Get 'em all!</span>
          </button>
        </div>
        <form action="" className="grid gap-2 mt-8 ">
          <div className="relative grid gap-2 ">
            <label htmlFor="" className="font-bold text-lg">
              Want to backup any specific public playlist instead?
            </label>

            <div className="relative grid md:flex items-center gap-2 md:gap-8">
              <p className="text-base">Paste Spotify Link</p>

              <div className="relative">
                <Icon
                  icon="system-uicons:link"
                  className="text-gray-300 absolute top-1 "
                  width={30}
                  height={30}
                />
                <input
                  type="text"
                  placeholder="e.g: https://open.spotify.com/playlist/:playlistId"
                  value={hook.spotifyLink}
                  onChange={(e) => hook.setSpotifyLink(e.target.value)}
                  className="py-1  pl-10 border-b border-gray-500 placeholder-gray-500 text-white bg-transparent outline-none"
                />
              </div>

              <button
                type="button"
                onClick={hook.getPlaylistById}
                className="text-white bg-gray-500 w-fit rounded-md py-1 px-2 font-semibold flex gap-1"
              >
                <Icon
                  icon="fluent:clipboard-paste-32-filled"
                  width={20}
                  height={20}
                />
                <span> Get Playlist</span>
              </button>
            </div>
          </div>

          <p>Playlist ID: {hook.extractedPlaylistId}</p>
        </form>
      </div>
      {hook.isPlaylistsLoading && (
        <div className=" bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-white text-lg mb-4">Fetching playlists...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      )}
      {hook.singlePlaylist && (
        <SinglePlaylistDisplay
          playlist={hook.singlePlaylist}
          handleBackup={hook.handleBackupSinglePlaylist}
          isBackingUp={hook.isBackingUp}
        />
      )}

      {hook.playlists && (
        <PlaylistsDisplay
          playlists={hook.playlists}
          onBackup={hook.handleBackup}
        />
      )}

      {hook.isBackingUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-white text-lg mb-4">Backing up playlists...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      )}
    </section>
  );
}
