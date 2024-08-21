import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PlaylistFormBlock from "./blocks/playlist-backup-block/PlaylistFormBlock";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen text-white grid place-items-center">
        <div className="py-2 px-8 grid gap-3">
          <div className="text-center">
            <div>Spotify Backup</div>
            <div className="text-sm">Backup your Spotify playlists</div>
          </div>
          <Routes>
            <Route path="/" element={<PlaylistFormBlock />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
