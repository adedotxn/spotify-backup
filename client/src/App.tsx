import "./App.css";
import PlaylistFormBlock from "./blocks/playlist-form-block/PlaylistFormBlock";

function App() {
  return (
    <div className="bg-black h-screen text-white grid place-items-center md:w-full">
      <div className="w-10/12 md:w-6/12">
        <div>Spotify Backup</div>

        <PlaylistFormBlock />
      </div>
    </div>
  );
}

export default App;
