import { useState, useEffect } from 'react';
import { buildTitle } from '../../constants/appMeta.js';
import { useRequireToken } from '../../hooks/useRequireToken.js';
import PlayListItem from '../../components/PlayListItem/PlayListItem.jsx';
import { fetchUserPlaylists } from '../../api/spotify-me.js';
import { handleTokenError } from '../../utils/handleTokenError.js';
import './PlaylistsPage.css';
import '../PageLayout.css';
import { useNavigate } from 'react-router-dom';

/**
 * Number of playlists to fetch
 */
export const limit = 10;

/**
 * Playlists Page
 * @returns {JSX.Element}
 */
export default function PlaylistsPage() {
  const navigate = useNavigate();

  // playlists réellement affichées
  const [playlists, setPlaylists] = useState([]);

  // 👇 NOUVEL ÉTAT : total de playlists dans le compte Spotify
  const [totalPlaylists, setTotalPlaylists] = useState(0);

  // loading + error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useRequireToken();

  useEffect(() => {
    document.title = buildTitle('Playlists');
  }, []);

  useEffect(() => {
    if (!token) return;

    fetchUserPlaylists(token, limit)
      .then(res => {
        if (res.error) {
          if (!handleTokenError(res.error, navigate)) {
            setError(res.error);
          }
        }

        // playlists à afficher
        setPlaylists(res.data.items ?? []);

        // 👇 on stocke aussi le total retourné par l’API
        setTotalPlaylists(res.data.total ?? 0);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, navigate]);

  return (
    <section className="playlists-container page-container" aria-labelledby="playlists-title">
      <h1 id="playlists-title" className="playlists-title page-title">
        Your Playlists
      </h1>

      {/* Pour l’instant : nombre de playlists réellement chargées */}
      <h2 className="playlists-count">
        {playlists.length} Playlists
      </h2>

      {loading && (
        <output className="playlists-loading" data-testid="loading-indicator">
          Loading playlists…
        </output>
      )}

      {error && !loading && (
        <div className="playlists-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ol className="playlists-list">
          {playlists.map((playlist) => (
            <PlayListItem key={playlist.id} playlist={playlist} />
          ))}
        </ol>
      )}
    </section>
  );
}
