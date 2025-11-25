/**
 * Spotify API interaction functions with /me endpoints.
 */

import { SPOTIFY_API_BASE } from "./spotify-commons";

/**
 * Fetch the user's top artists from Spotify.
 * @returns {Promise<{ artists: object[], error: string|null }>}
 */
export async function fetchUserTopArtists(token, limit = 10, timeRange = "short_term") {
  if (!token) {
    return { error: "No access token found.", artists: [] };
  }

  try {
    const res = await fetch(
      `${SPOTIFY_API_BASE}/me/top/artists?limit=${limit}&time_range=${timeRange}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();

    if (data.error) {
      return { error: data.error.message, artists: [] };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch top artists.", artists: [] };
  }
}

/**
 * Fetch account profile
 */
export async function fetchAccountProfile(token) {
  if (!token) {
    return { error: "No access token found.", profile: null };
  }

  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.error) {
      return { error: data.error.message, data: null };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch account info.", profile: null };
  }
}

/**
 * Fetch playlists
 */
export async function fetchUserPlaylists(token, limit = 10) {
  if (!token) {
    return { error: "No access token found.", playlists: [] };
  }

  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/me/playlists?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.error) {
      return { error: data.error.message, data: { items: [], total: 0 } };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch playlists.", data: { items: [], total: 0 } };
  }
}

/**
 * Fetch user's top tracks
 */
export async function fetchUserTopTracks(token, limit = 10, timeRange = "short_term") {
  if (!token) {
    return { error: "No access token found.", tracks: [] };
  }

  try {
    const res = await fetch(
      `${SPOTIFY_API_BASE}/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (data.error) {
      return { error: data.error.message, tracks: [] };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch top tracks.", data: { items: [], total: 0 } };
  }
}

/**
 * Fetch playlist BY ID — FIXED FOR SONAR
 */
export async function fetchPlaylistById(token, playlistId) {
  if (!token) {
    return { error: "No access token found.", data: null };
  }

  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data?.error?.message) {
      return { error: data.error.message, data: null };
    }

    return { data, error: null };
  } catch (e) {
    return { error: "Failed to fetch playlist.", data: null };
  }
}
