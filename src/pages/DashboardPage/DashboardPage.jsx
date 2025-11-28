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

  // Titre de la page
  useEffect(() => {
    document.title = buildTitle('Dashboard');
  }, []);

  // Chargement des données
  useEffect(() => {
    if (!token) return;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // Top artist
        const artistRes = await fetchUserTopArtists(token, 1, 'short_term');
        if (artistRes.error) {
          throw new Error(artistRes.error);
        }
        const artist = artistRes.data?.items?.[0] ?? null;
        setTopArtist(artist);

        // Top track
        const trackRes = await fetchUserTopTracks(token, 1, 'short_term');
        if (trackRes.error) {
          throw new Error(trackRes.error);
        }
        const track = trackRes.data?.items?.[0] ?? null;
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
        {/* pas de role pour éviter l’erreur eslint no-redundant-roles */}
        <output>Loading dashboard…</output>
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
    <section
      className="dashboard page-container"
      aria-labelledby="dashboard-title"
    >
      <h1 id="dashboard-title" className="page-title">
        Dashboard
      </h1>

      {/* ARTISTE LE PLUS ÉCOUTÉ */}
      <div className="dashboard-section">
        <h2>🎤 Most listened artist</h2>
        {topArtist ? (
          <SimpleCard
            imageUrl={topArtist.images?.[0]?.url} // <-- CORRECTION APPLIQUÉE
            imageAlt={topArtist.name}
            title={topArtist.name}
            subtitle={
              topArtist.genres?.length
                ? topArtist.genres.join(', ')
                : 'No genres available'
            }
          />
        ) : (
          <p>No artist data available.</p>
        )}
      </div>

      {/* PISTE LA PLUS ÉCOUTÉE */}
      <div className="dashboard-section">
        <h2>🎧 Most listened track</h2>
        {topTrack ? (
          <SimpleCard
            imageUrl={topTrack.album?.images?.[0]?.url} // <-- CORRECTION APPLIQUÉE
            imageAlt={topTrack.name}
            title={topTrack.name}
            subtitle={topTrack.artists?.map((a) => a.name).join(', ') || ''}
          />
        ) : (
          <p>No track data available.</p>
        )}
      </div>
    </section>
  );
}