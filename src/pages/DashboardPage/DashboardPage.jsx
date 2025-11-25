// src/pages/DashboardPage/DashboardPage.jsx

import { useEffect, useState } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopArtists, fetchUserTopTracks } from '../../api/spotify-me.js';

import '../../styles/DashboardPage.css';

export default function DashboardPage() {
  const { token } = useRequireToken();

  const [topArtist, setTopArtist] = useState(null);
  const [topTrack, setTopTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Title
  useEffect(() => {
    document.title = buildTitle('Dashboard');
  }, []);

  // Fetch data
  useEffect(() => {
    if (!token) return;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // --- TOP ARTISTS ---
        const artistRes = await fetchUserTopArtists(token, 1, 'short_term');

        if (artistRes.error) {
          setError(artistRes.error);
          return;
        }

        const artist = artistRes.data?.items?.[0];
        console.log("🎨 TOP ARTIST:", artist);
        setTopArtist(artist);

        // --- TOP TRACKS ---
        const trackRes = await fetchUserTopTracks(token, 1, 'short_term');

        if (trackRes.error) {
          setError(trackRes.error);
          return;
        }

        const track = trackRes.data?.items?.[0];
        console.log("🎵 TOP TRACK:", track);
        setTopTrack(track);

      } catch (err) {
        setError(err.message ?? "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  return (
    <section className="dashboard page-container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="page-title">
        Dashboard
      </h1>

      {loading && <p>Loading dashboard…</p>}
      {error && <p role="alert">Error: {error}</p>}

      {!loading && !error && (
        <>
          <p className="dashboard-intro">Spotify overview:</p>

          <pre style={{ background: "#111", padding: "12px", borderRadius: "8px" }}>
            {JSON.stringify({ topArtist, topTrack }, null, 2)}
          </pre>
        </>
      )}
    </section>
  );
}
