// src/pages/PlaylistPage/PlaylistPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequireToken } from "../../hooks/useRequireToken.js";
import { fetchPlaylistById } from "../../api/spotify-playlists.js";
import { handleTokenError } from "../../utils/handleTokenError.js";
import TrackItem from "../../components/TrackItem/TrackItem.jsx";
import "../../styles/PlaylistDetailPage.css";

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return; // attend le token

    fetchPlaylistById(token, id)
      .then((res) => {
        if (res.error) {
          // si le token a expiré, on laisse handleTokenError rediriger
          if (!handleTokenError(res.error, navigate)) {
            setError(res.error);
          }
          return;
        }

        setPlaylist(res.data);
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load playlist.");
      })
      .finally(() => setLoading(false));
  }, [token, id, navigate]);

  // États simples
  if (loading) {
    return (
      <section className="playlist-detail-container">
        <div className="playlist-detail-message">Loading playlist…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="playlist-detail-container">
        <div className="playlist-detail-message error">❌ {error}</div>
      </section>
    );
  }

  if (!playlist) {
    return (
      <section className="playlist-detail-container">
        <div className="playlist-detail-message">Playlist not found.</div>
      </section>
    );
  }

  return (
    <section className="playlist-detail-container">
      {/* HEADER */}
      <div className="playlist-detail-header">
        {playlist.images?.[0] && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="playlist-detail-cover"
          />
        )}

        <div className="playlist-detail-info">
          <h1 className="playlist-detail-title">{playlist.name}</h1>
          <p className="playlist-detail-description">
            {playlist.description || "No description available."}
          </p>
          {playlist.owner?.display_name && (
            <p className="playlist-detail-owner">
              By {playlist.owner.display_name}
            </p>
          )}

          {playlist.external_urls?.spotify && (
            <a
              className="playlist-open-button"
              href={playlist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶️ Lire la playlist sur Spotify
            </a>
          )}
        </div>
      </div>

      {/* LISTE DES PISTES */}
      <ol className="playlist-track-list">
        {playlist.tracks?.items?.map((item, index) => (
          <TrackItem
            key={item.track?.id ?? `${playlist.id}-${index}`}
            track={item.track}
            index={index}
          />
        ))}
      </ol>
    </section>
  );
}
