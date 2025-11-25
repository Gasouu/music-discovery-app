// src/pages/PlaylistPage/PlaylistPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchPlaylistById } from '../../api/spotify-playlists.js';
import { handleTokenError } from '../../utils/handleTokenError.js';
import TrackItem from '../../components/TrackItem/TrackItem.jsx';

import '../PageLayout.css';
import '../../styles/PlaylistDetailPage.css';

/**
 * Page de détail d'une playlist
 * Affiche les infos de la playlist + la liste des pistes.
 */
export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // titre de la page
  useEffect(() => {
    document.title = buildTitle('Playlist');
  }, []);

  // chargement de la playlist
  useEffect(() => {
    if (!token || !id) return;

    setLoading(true);
    setError(null);

    fetchPlaylistById(token, id)
      .then((res) => {
        if (res.error) {
          // gestion des erreurs de token expiré
          if (!handleTokenError(res.error, navigate)) {
            setError(res.error);
          }
          return;
        }
        setPlaylist(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, id, navigate]);

  const imageUrl = playlist?.images?.[0]?.url ?? '';
  const ownerName = playlist?.owner?.display_name ?? '';
  const playlistUrl = playlist?.external_urls?.spotify ?? '#';
  const tracksItems = playlist?.tracks?.items ?? [];

  return (
    <section
      className="playlist-detail page-container"
      aria-labelledby="playlist-title"
    >
      {loading && (
        <output
          className="playlist-detail-loading"
          data-testid="loading-indicator"
        >
          Loading playlist…
        </output>
      )}

      {error && !loading && (
        <div className="playlist-detail-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && playlist && (
        <>
          {/* En-tête de la playlist */}
          <header className="playlist-detail-header">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={playlist.name}
                className="playlist-detail-cover"
              />
            )}

            <div className="playlist-detail-meta">
              <h1 id="playlist-title" className="playlist-detail-title">
                {playlist.name}
              </h1>

              <p className="playlist-detail-description">
                {playlist.description || 'No description available.'}
              </p>

              {ownerName && (
                <p className="playlist-detail-owner">By {ownerName}</p>
              )}

              {playlistUrl && (
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="playlist-detail-play-button"
                >
                  ▶ Lire la playlist sur Spotify
                </a>
              )}
            </div>
          </header>

          {/* Liste des pistes */}
          <section className="playlist-detail-tracks">
            {tracksItems.length === 0 ? (
              <p className="playlist-detail-empty">
                This playlist has no tracks yet.
              </p>
            ) : (
              <ol className="playlist-detail-tracks-list">
                {tracksItems.map((item, index) => (
                  <TrackItem
                    key={item.track.id}
                    track={item.track}
                    index={index}
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
