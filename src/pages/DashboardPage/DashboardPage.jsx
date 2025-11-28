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
        // --- Top artist ---
        const artistRes = await fetchUserTopArtists(token, 1, 'short_term');
        if (artistRes.error) {
          throw new Error(artistRes.error);
        }
        setTopArtist(artistRes.data?.items?.[0] ?? null); // Simplification de l'assignation

        // --- Top track ---
        const trackRes = await fetchUserTopTracks(token, 1, 'short_term');
        if (trackRes.error) {
          throw new Error(trackRes.error);
        }
        setTopTrack(trackRes.data?.items?.[0] ?? null); // Simplification de l'assignation

      } catch (err) {
        // Cette branche DOIT être couverte par un test
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);
  
  // --- RENDU CONDITIONNEL ---
  
  if (loading) {
    // Cette branche DOIT être couverte par un test
    return (
      <section className="dashboard page-container">
        <output>Loading dashboard…</output>
      </section>
    );
  }

  if (error) {
    // Cette branche DOIT être couverte par un test (simulation d'erreur)
    return (
      <section className="dashboard page-container">
        <div role="alert">Error: {error}</div>
      </section>
    );
  }

  // Fonctions d'aide pour le rendu (pour simplifier le JSX)
  const renderArtistCard = () => {
    if (!topArtist) {
      // Cette branche DOIT être couverte par un test (topArtist est null)
      return <p>No artist data available.</p>;
    }
    
    // Le JSX est le plus simple possible
    const subtitle = topArtist.genres?.length
      ? topArtist.genres.join(', ')
      : 'No genres available';

    return (
      <SimpleCard
        imageUrl={topArtist.images?.[0]?.url}
        imageAlt={topArtist.name}
        title={topArtist.name}
        subtitle={subtitle}
      />
    );
  };
  
  const renderTrackCard = () => {
    if (!topTrack) {
      // Cette branche DOIT être couverte par un test (topTrack est null)
      return <p>No track data available.</p>;
    }

    // Le JSX est le plus simple possible
    const subtitle = topTrack.artists?.map((a) => a.name).join(', ') || '';

    return (
      <SimpleCard
        imageUrl={topTrack.album?.images?.[0]?.url}
        imageAlt={topTrack.name}
        title={topTrack.name}
        subtitle={subtitle}
      />
    );
  };

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
        {renderArtistCard()} 
      </div>

      {/* PISTE LA PLUS ÉCOUTÉE */}
      <div className="dashboard-section">
        <h2>🎧 Most listened track</h2>
        {renderTrackCard()}
      </div>
    </section>
  );
}