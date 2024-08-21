import { useEffect, useState } from "react";
import { removeFromLocalStorage } from "../../utils/localStorage";
import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
} from "../../utils/constants";
import spotifyService from "../../services/spotify.service";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

export const useLoginBlock = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a code in the URL (after redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      handleCallback(code);
    }
  }, []);

  const { data, error } = useSWR(
    isLoggedIn ? null : "spotifyService.getCurrentUser",
    spotifyService.getCurrentUser,
  );

  useEffect(() => {
    if (data && data.id) {
      setIsLoggedIn(true);
    }

    if (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);

      handleLogin();
    }
  }, [data, error]);

  const handleCallback = async (code: string) => {
    try {
      await spotifyService.getTokens(code);
      setIsLoggedIn(true);
      navigate("/"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogin = async () => {
    const authUrl = await spotifyService.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    removeFromLocalStorage(SPOTIFY_ACCESS_TOKEN);
    removeFromLocalStorage(SPOTIFY_REFRESH_TOKEN);
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
  };
};
