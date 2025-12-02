// src/pages/PlaylistPage/PlaylistPage.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchPlaylistById } from '../../api/spotify-playlists.js';
import { handleTokenError } from '../../utils/handleTokenError.js';
import TrackItem from '../../components/TrackItem/TrackItem.jsx';

import '../../styles/PlaylistDetailPage.css';

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // titre de page
  useEffect(() => {
    document.title = buildTitle('Playlist');
  }, []);

  // récupération de la playlist
  useEffect(() => {
    if (!token || !id) {
      return;
    }

    let isCancelled = false;

    async function loadPlaylist() {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await fetchPlaylistById(token, id);

        if (error) {
          // gestion du token expiré
          if (!handleTokenError(error, navigate)) {
            if (!isCancelled) {
              setError(error);
              setPlaylist(null);
            }
          }
          return;
        }

        if (!isCancelled) {
          setPlaylist(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message ?? 'Unable to load playlist.');
          setPlaylist(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadPlaylist();

    return () => {
      isCancelled = true;
    };
  }, [token, id, navigate]);

  const tracks = playlist?.tracks?.items ?? [];

  return (
    <section
      className="playlist-detail page-container"
      aria-labelledby="playlist-detail-title"
    >
      {/* États de chargement / erreur */}
      {loading && (
        <output
          className="playlist-detail-loading"
          data-testid="loading-indicator"
          aria-live="polite"
        >
          Loading playlist…
        </output>
      )}

      {!loading && error && (
        <div className="playlist-detail-error" role="alert">
          Failed to load playlist: {error}
        </div>
      )}

      {!loading && !error && !playlist && (
        <p className="playlist-detail-empty" data-testid="playlist-empty">
          Playlist not found.
        </p>
      )}

      {!loading && !error && playlist && (
        <>
          {/* HEADER */}
          <header className="playlist-detail-header">
            <img
              className="playlist-detail-cover"
              src={playlist.images?.[0]?.url}
              alt={playlist.name}
            />
            <div className="playlist-detail-meta">
              <h1
                id="playlist-detail-title"
                className="playlist-detail-title page-title"
              >
                {playlist.name}
              </h1>
              <p className="playlist-detail-description">
                {playlist.description || 'No description available.'}
              </p>
              <p className="playlist-detail-owner">
                By {playlist.owner?.display_name ?? 'Unknown'}
              </p>
              {playlist.external_urls?.spotify && (
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="playlist-detail-open-button"
                >
                  ▶ Lire la playlist sur Spotify
                </a>
              )}
            </div>
          </header>

          {/* TRACKS */}
          <section className="playlist-detail-tracks-section">
            {tracks.length === 0 ? (
              <p className="playlist-detail-empty" data-testid="playlist-no-tracks">
                This playlist has no tracks yet.
              </p>
            ) : (
              <ol
                className="playlist-detail-tracks"
                aria-label="Tracks in this playlist"
              >
                {tracks.map((item, index) => (
                  <TrackItem
                    key={item.track?.id ?? `${index}`}
                    track={item.track}
                    index={index + 1}
                  />
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </section>
  );
}
