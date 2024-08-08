import { useState } from "react";
import "./App.css";

function App() {
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
  return (
    <>
      <div>Spotify Backup</div>

      <form action="">
        <label htmlFor="">Paste spotify link</label>
        <input
          type="text"
          placeholder="e.g: https://open.spotify.com/playlist/7Ar78fb9aQIkO3mIrtiit7?si=809c50b94c8b4295"
          value={spotifyLink}
          onChange={(e) => setSpotifyLink(e.target.value)}
        />

        <p>Playlist ID: {extractPlaylistId(spotifyLink ?? "")}</p>
      </form>
    </>
  );
}

export default App;
