import { Icon } from "@iconify/react/dist/iconify.js";
import { usePlaylistFormBlock } from "./usePlaylistFormBlock";

export default function PlaylistFormBlock() {
  const {
    spotifyLink,
    setSpotifyLink,
    extractPlaylistId,
    getAccessToken,
    getPlaylist,
  } = usePlaylistFormBlock();
  return (
    <form action="" className="grid gap-2 mt-3 ">
      <div className="relative grid gap-2">
        <label htmlFor="" className="font-bold text-xl">
          Paste Spotify Link
        </label>
        <Icon
          icon="system-uicons:link"
          className="text-gray-300 absolute bottom-2 "
          width={30}
          height={30}
        />
        <input
          type="text"
          placeholder="e.g: https://open.spotify.com/playlist/7Ar78fb9aQIkO3mIrtiit7?si=809c50b94c8b4295"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
          className="py-2  pl-10 border-b border-gray-500 placeholder-gray-500 text-white bg-transparent outline-none"
        />
      </div>

      <p>Playlist ID: {extractPlaylistId(spotifyLink ?? "")}</p>

      <button
        type="button"
        onClick={getPlaylist}
        className="text-white bg-gray-500 w-fit rounded-md py-2 px-2 font-semibold flex gap-1"
      >
        <Icon icon="fluent:clipboard-paste-32-filled" width={20} height={20} />
        <span> Get Playlist</span>
      </button>
      <button
        onClick={getAccessToken}
        type="button"
        className="text-white bg-gray-500 w-fit rounded-md py-1 px-2 font-semibold flex items-center"
      >
        <Icon icon="academicons:open-access" width={20} height={20} />
        <span> Get access token</span>
      </button>
    </form>
  );
}
