import { Icon } from "@iconify/react/dist/iconify.js";
import { useLoginBlock } from "./useLoginBlock";
import useSWR from "swr";
import spotifyService from "../../services/spotify.service";

const LoginBlock = () => {
  const { isLoggedIn, handleLogin, handleLogout } = useLoginBlock();

  const { data, error } = useSWR(
    "spotifyService.getCurrentUser",
    spotifyService.getCurrentUser,
  );

  console.log("isloggedin", isLoggedIn);

  console.log("yoooooo", { data, error });

  return (
    <div>
      <div>
        <button
          onClick={isLoggedIn ? handleLogout : handleLogin}
          disabled={isLoggedIn}
          className={`text-white ${
            isLoggedIn ? "bg-green-700" : "bg-gray-500"
          } w-fit rounded-md py-1 px-1 font-semibold flex items-center `}
        >
          <Icon
            icon={isLoggedIn ? "uim:lock-alt" : "academicons:open-access"}
            width={20}
            height={20}
          />
          <span> {isLoggedIn ? `` : "Login with Spotify"}</span>
        </button>

        {isLoggedIn && (
          <p className="text-lg py-2 underline">Hey, {data?.display_name}</p>
        )}
      </div>

      <div></div>
    </div>
  );
};

export default LoginBlock;
