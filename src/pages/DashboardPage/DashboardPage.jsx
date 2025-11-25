// src/pages/DashboardPage/DashboardPage.jsx

import { useEffect, useState } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopArtists, fetchUserTopTracks } from '../../api/spotify-me.js';
import SimpleCard from '../../components/SimpleCard/SimpleCard.jsx';
import '../../styles/DashboardPage.css';

export default function DashboardPage() {
  const { token } = useRequireToken();

  const [topArtist, setTopArtist] = useState(null);
  const [topTrack, setTopTrack] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = buildTitle('Dashboard');
  }, []);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch top artist
        const artistRes = await fetchUserTopArtists(token, 1, 'short_term');
        if (artistRes.error) throw new Error(artistRes.error);

        const artist = artistRes.data.items?.[0] ?? null;
        setTopArtist(artist);

        // Fetch top track
        const trackRes = await fetchUserTopTracks(token, 1, 'short_term');
        if (trackRes.error) throw new Error(trackRes.error);

        const track = trackRes.data.items?.[0] ?? null;
        setTopTrack(track);

      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  if (loading) {
    return (
      <section className="dashboard page-container">
        <output role="status">Loading dashboard…</output>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard page-container">
        <div role="alert">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="dashboard page-container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="page-title">Dashboard</h1>

      <div className="dashboard-section">
        <h2>🎤 Most listened artist</h2>
        {topArtist ? (
          <SimpleCard
            image={topArtist.images?.[0]?.url}
            title={topArtist.name}
            subtitle={topArtist.genres.join(', ') || 'No genres available'}
          />
        ) : (
          <p>No artist data available.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h2>🎧 Most listened track</h2>
        {topTrack ? (
          <SimpleCard
            image={topTrack.album?.images?.[0]?.url}
            title={topTrack.name}
            subtitle={topTrack.artists.map(a => a.name).join(', ')}
          />
        ) : (
          <p>No track data available.</p>
        )}
      </div>
    </section>
  );
}
