import { useEffect, useState, useCallback } from "react";
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
  const [shouldFetch, setShouldFetch] = useState(false);
  const navigate = useNavigate();

  const { data, error, mutate } = useSWR(
    shouldFetch ? "spotifyService.getCurrentUser" : null,
    spotifyService.getCurrentUser,
    {
      onErrorRetry: (_error, _key, _config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    },
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleCallback(code);
    } else {
      // Check if we have tokens in localStorage
      const accessToken = localStorage.getItem(SPOTIFY_ACCESS_TOKEN);
      if (accessToken) {
        setShouldFetch(true);
      }
    }
  }, []);

  useEffect(() => {
    if (data && data.id) {
      setIsLoggedIn(true);
      setShouldFetch(true);
    } else if (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
      setShouldFetch(false);
      // Don't automatically trigger handleLogin here
    }
  }, [data, error]);

  const handleCallback = useCallback(
    async (code: string) => {
      try {
        await spotifyService.getTokens(code);
        setIsLoggedIn(true);
        setShouldFetch(true);
        mutate(); // Revalidate user data after getting tokens
        navigate("/"); // Redirect to dashboard after successful login
      } catch (error) {
        console.error("Error during login:", error);
        setIsLoggedIn(false);
        setShouldFetch(false);
      }
    },
    [navigate, mutate],
  );

  const handleLogin = useCallback(async () => {
    try {
      const authUrl = await spotifyService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error getting auth URL:", error);
    }
  }, []);

  const handleLogout = useCallback(() => {
    removeFromLocalStorage(SPOTIFY_ACCESS_TOKEN);
    removeFromLocalStorage(SPOTIFY_REFRESH_TOKEN);
    setIsLoggedIn(false);
    setShouldFetch(false);
    mutate(); // Clear the user data in SWR cache
  }, [mutate]);

  return {
    isLoggedIn,
    handleLogin,
    handleLogout,
    data,
  };
};
