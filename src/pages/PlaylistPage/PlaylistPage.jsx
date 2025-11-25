// src/pages/PlaylistPage/PlaylistPage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequireToken } from "../../hooks/useRequireToken";
import { fetchPlaylistById } from "../../api/spotify-playlists";
import { handleTokenError } from "../../utils/handleTokenError";
import TrackItem from "../../components/TrackItem/TrackItem.jsx";
import "../../styles/PlaylistDetailPage.css";


export default function PlaylistPage() {
  const { id } = useParams();
  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetchPlaylistById(token, id)
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setPlaylist(res.data);
        }
      })
      .catch(() => setError("Failed to load playlist."))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) return <div className="playlist-detail-container">Loading...</div>;
  if (error) return <div className="playlist-detail-container">❌ {error}</div>;
  if (!playlist) return <div className="playlist-detail-container">Playlist not found.</div>;

  return (
    <section className="playlist-detail-container">

      {/* HEADER */}
      <div className="playlist-detail-header">
        {playlist.images?.[0] && (
          <img
            src={playlist.images[0].url}
            alt="playlist cover"
            className="playlist-detail-cover"
          />
        )}

        <div className="playlist-detail-info">
          <h1 className="playlist-detail-title">{playlist.name}</h1>
          <p className="playlist-detail-description">
            {playlist.description || "No description"}
          </p>
          <p className="playlist-detail-owner">By {playlist.owner?.display_name}</p>

          <a
            className="playlist-open-button"
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            ▶️ Lire sur Spotify
          </a>
        </div>
      </div>

      {/* TRACK LIST */}
      <ol className="playlist-track-list">
        {playlist.tracks?.items?.map((item, i) => (
          <TrackItem key={i} track={item.track} index={i} />
        ))}
      </ol>
    </section>
  );
}
