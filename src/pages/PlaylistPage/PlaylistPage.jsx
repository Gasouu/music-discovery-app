import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buildTitle } from "../../constants/appMeta";
import { useRequireToken } from "../../hooks/useRequireToken";
import { fetchPlaylistById } from "../../api/spotify-playlists";
import { handleTokenError } from "../../utils/handleTokenError";
import "../../styles/PlaylistDetailPage.css";

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = buildTitle("Playlist Details");
  }, []);

  useEffect(() => {
    if (!token || !id) return;

    fetchPlaylistById(token, id)
      .then((res) => {
        if (res.error) {
          if (!handleTokenError(res.error, navigate)) {
            setError(res.error);
          }
        } else {
          setPlaylist(res.data);
        }
      })
      .catch(() => setError("Failed to fetch playlist"))
      .finally(() => setLoading(false));
  }, [token, id, navigate]);

  if (loading) {
    return <div className="playlist-loading">Loading playlist…</div>;
  }

  if (error) {
    return (
      <div className="playlist-error" role="alert">
        {error}
      </div>
    );
  }

  if (!playlist) {
    return <div className="playlist-error">Playlist not found.</div>;
  }

  return (
    <section className="playlist-detail-container page-container">
      <h1 className="playlist-title page-title">{playlist.name}</h1>

      <div className="playlist-header">
        {playlist.images?.[0] && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="playlist-cover"
          />
        )}

        <div className="playlist-info">
          <p className="playlist-description">
            {playlist.description || "No description available."}
          </p>

          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="playlist-open-button"
          >
            Open on Spotify
          </a>
        </div>
      </div>
    </section>
  );
}
