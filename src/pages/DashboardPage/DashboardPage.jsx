// src/pages/DashboardPage/DashboardPage.jsx

import { useEffect, useState } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchUserTopArtists, fetchUserTopTracks } from '../../api/spotify-me.js';
import { handleTokenError } from '../../utils/handleTokenError.js';

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

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        // --- FETCH ARTISTS ---
        const artistsRes = await fetchUserTopArtists(token, 1);

        if (artistsRes.error) {
          if (!handleTokenError(artistsRes.error)) {
            setError(artistsRes.error);
          }
          setLoading(false);
          return;
        }

        const artist = artistsRes.data?.items?.[0] ?? null;

        // --- FETCH TRACKS ---
        const tracksRes = await fetchUserTopTracks(token, 1);

        if (tracksRes.error) {
          if (!handleTokenError(tracksRes.error)) {
            setError(tracksRes.error);
          }
          setLoading(false);
          return;
        }

        const track = tracksRes.data?.items?.[0] ?? null;

        setTopArtist(artist);
        setTopTrack(track);

      } catch (err) {
        setError(err.message ?? 'Unexpected error.');
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

      {loading && <p aria-live="polite">Loading dashboard…</p>}

      {!loading && error && (
        <div role="alert" className="dashboard-error">
          Failed to load dashboard: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ----- TOP ARTIST ----- */}
          <div className="dashboard-card">
            <h2>Most listened artist</h2>
            {topArtist ? (
              <div className="dashboard-section">
                <img
                  src={topArtist.images?.[0]?.url}
                  alt={topArtist.name}
                  className="dashboard-image"
                />
                <div>
                  <p className="dashboard-name">{topArtist.name}</p>
                  <p className="dashboard-subinfo">
                    Genres: {topArtist.genres?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p>No artist data available.</p>
            )}
          </div>

          {/* ----- TOP TRACK ----- */}
          <div className="dashboard-card">
            <h2>Most listened track</h2>
            {topTrack ? (
              <div className="dashboard-section">
                <img
                  src={topTrack.album?.images?.[0]?.url}
                  alt={topTrack.name}
                  className="dashboard-image"
                />
                <div>
                  <p className="dashboard-name">{topTrack.name}</p>
                  <p className="dashboard-subinfo">
                    Artists: {topTrack.artists?.map(a => a.name).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p>No track data available.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
