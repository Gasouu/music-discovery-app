// src/pages/PlaylistPage/PlaylistPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import { fetchPlaylistById } from '../../api/spotify-me.js';
import { handleTokenError } from '../../utils/handleTokenError.js';

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useRequireToken();

  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetchPlaylistById(token, id)
      .then((res) => {
        if (res.error) {
          if (!handleTokenError(res.error, navigate)) {
            setError(res.error);
          }
        } else {
          console.log('📌 Playlist récupérée :', res.data);
          setPlaylist(res.data);
        }
      })
      .catch((err) => {
        console.error('❌ Erreur API playlist :', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, id, navigate]);

  return (
    <section>
      <h1>Playlist Detail Page</h1>
      <p>Playlist ID: {id}</p>

      {loading && <p>Chargement…</p>}

      {error && (
        <p style={{ color: 'red' }}>
          Erreur : {error}
        </p>
      )}

      {!loading && !error && !playlist && <p>Aucune donnée de playlist.</p>}
    </section>
  );
}
