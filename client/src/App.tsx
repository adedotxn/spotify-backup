import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginBlock from "./blocks/login-block/LoginBlock";
import PlaylistFormBlock from "./blocks/playlist-backup-block/PlaylistFormBlock";

// import PlaylistFormBlock from "./blocks/playlist-form-block/PlaylistFormBlock";

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
            {/* <Route path="/dashboard" element={< />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
