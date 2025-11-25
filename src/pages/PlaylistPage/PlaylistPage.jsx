// src/pages/PlaylistPage/PlaylistPage.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useRequireToken } from "../../hooks/useRequireToken";
import { fetchPlaylistById } from "../../api/spotify-playlists";
import { handleTokenError } from "../../utils/handleTokenError";
import TrackItem from "../../components/TrackItem/TrackItem.jsx";
import { buildTitle } from "../../constants/appMeta";

import "../../styles/PlaylistDetailPage.css";

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Titre de la page
  useEffect(() => {
    document.title = buildTitle("Playlist");
  }, []);

  // Chargement de la playlist
  useEffect(() => {
    if (!token || !id) return;

    setLoading(true);
    setError(null);

    fetchPlaylistById(token, id)
      .then((res) => {
        if (res.error) {
          // si token expiré -> redirection gérée par handleTokenError
          if (!handleTokenError(res.error, navigate)) {
            setError(res.error);
          }
          setPlaylist(null);
          return;
        }

        setPlaylist(res.data);
      })
      .catch((err) => {
        setError(err.message);
        setPlaylist(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, id, navigate]);

  // ⏳ Loading
  if (loading) {
    return (
      <section className="playlist-detail-container">
        <p className="playlist-detail-loading" role="status">
          Loading playlist…
        </p>
      </section>
    );
  }

  // ❌ Erreur
  if (error) {
    return (
      <section className="playlist-detail-container">
        <div className="playlist-detail-error" role="alert">
          {error}
        </div>
      </section>
    );
  }

  // 🚫 Playlist inexistante
  if (!playlist) {
    return (
      <section className="playlist-detail-container">
        <div className="playlist-detail-empty" role="alert">
          Playlist not found.
        </div>
      </section>
    );
  }

  const hasTracks = playlist.tracks?.items?.length > 0;

  return (
    <section
      className="playlist-detail-container"
      aria-labelledby="playlist-detail-title"
    >
      <header className="playlist-detail-header">
        {playlist.images?.[0] && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="playlist-detail-cover"
          />
        )}

        <div className="playlist-detail-meta">
          <h1
            id="playlist-detail-title"
            className="playlist-detail-title page-title"
          >
            {playlist.name}
          </h1>

          <p className="playlist-detail-description">
            {playlist.description || "No description available."}
          </p>

          <p className="playlist-detail-owner">
            By {playlist.owner?.display_name ?? "Unknown"}
          </p>

          {playlist.external_urls?.spotify && (
            <a
              className="playlist-detail-play-button"
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lire la playlist sur Spotify
            </a>
          )}
        </div>
      </header>

      <section className="playlist-detail-tracks">
        {hasTracks ? (
          <ol className="playlist-detail-tracks-list">
            {playlist.tracks.items.map((item, index) => (
              <TrackItem
                key={item.track.id ?? index}
                track={item.track}
                index={index}
              />
            ))}
          </ol>
        ) : (
          <p className="playlist-detail-empty">Cette playlist est vide.</p>
        )}
      </section>
    </section>
  );
}
