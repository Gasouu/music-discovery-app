/**
 * Spotify API interaction functions with /me endpoints.
 */

import { SPOTIFY_API_BASE } from "./spotify-commons";

/**
 * Fetch the user's top artists from Spotify.
 * @param {string} token - The Spotify access token.
 * @param {number} [limit=10]
 * @param {string} [timeRange='short_term']
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function fetchUserTopArtists(token, limit = 10, timeRange = "short_term") {
  if (!token) {
    return { error: "No access token found.", data: null };
  }

  try {
    const res = await fetch(
      `${SPOTIFY_API_BASE}/me/top/artists?limit=${limit}&time_range=${timeRange}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    if (data.error) {
      return { error: data.error.message, data: null };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch top artists.", data: null };
  }
}

/**
 * Fetch the Spotify account profile for the given access token.
 * @param {string} token
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function fetchAccountProfile(token) {
  if (!token) {
    return { error: "No access token found.", data: null };
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
    return { error: "Failed to fetch account info.", data: null };
  }
}

/**
 * Fetch the user's playlists from Spotify.
 * @param {string} token
 * @param {number} [limit=10]
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function fetchUserPlaylists(token, limit = 10) {
  if (!token) {
    return { error: "No access token found.", data: null };
  }

  try {
    const res = await fetch(`${SPOTIFY_API_BASE}/me/playlists?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.error) {
      return { error: data.error.message, data: null };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch playlists.", data: null };
  }
}

/**
 * Fetch the user's top tracks from Spotify.
 * @param {string} token
 * @param {number} [limit=10]
 * @param {string} [timeRange='short_term']
 * @returns {Promise<{ data: object|null, error: string|null }>}
 */
export async function fetchUserTopTracks(token, limit = 10, timeRange = "short_term") {
  if (!token) {
    return { error: "No access token found.", data: null };
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
      return { error: data.error.message, data: null };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch top tracks.", data: null };
  }
}

/**
 * Fetch a playlist by ID (with tracks)
 * @param {string} token
 * @param {string} playlistId
 * @returns {Promise<{ data: object|null, error: string|null }>}
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

    if (data.error) {
      return { error: data.error.message, data: null };
    }

    return { data, error: null };
  } catch {
    return { error: "Failed to fetch playlist.", data: null };
  }
}
