import { useEffect, useState, useCallback } from "react";
import {
  getLocalStorage,
  removeFromLocalStorage,
} from "../../utils/localStorage";
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

  const { data, error, mutate } = useSWR(
    "spotifyService.getCurrentUser",
    spotifyService.getCurrentUser,
    {
      revalidateOnFocus: false, // Disable automatic revalidation
      shouldRetryOnError: false, // Disable automatic retry
    },
  );

  const checkLoginStatus = useCallback(() => {
    const token = getLocalStorage(SPOTIFY_ACCESS_TOKEN);
    if (token && data && data.id) {
      setIsLoggedIn(true);
    } else if (error) {
      setIsLoggedIn(false);
      removeFromLocalStorage(SPOTIFY_ACCESS_TOKEN);
      removeFromLocalStorage(SPOTIFY_REFRESH_TOKEN);
      navigate("/");
    }
  }, [data, error, navigate]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleCallback = async (code: string) => {
    try {
      await spotifyService.getTokens(code);
      setIsLoggedIn(true);
      navigate("/"); // Redirect to dashboard after successful login
      mutate(); // Re-fetch user data
    } catch (err) {
      console.error("Error during login:", err);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleCallback(code);
    }
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const authUrl = await spotifyService.getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error("Error getting auth URL:", err);
    }
  }, []);

  const handleLogout = useCallback(() => {
    removeFromLocalStorage(SPOTIFY_ACCESS_TOKEN);
    removeFromLocalStorage(SPOTIFY_REFRESH_TOKEN);
    setIsLoggedIn(false);
    mutate(); // Clear the user data in SWR cache
    navigate("/login"); // Redirect to login page
  }, [mutate, navigate]);

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
    data,
  };
};
