// src/pages/DashboardPage/DashboardPage.jsx

import { useEffect, useState } from "react";
import { buildTitle } from "../../constants/appMeta.js";
import { useRequireToken } from "../../hooks/useRequireToken.js";
import { fetchUserTopArtists, fetchUserTopTracks } from "../../api/spotify-me.js";

import SimpleCard from "../../components/SimpleCard/SimpleCard.jsx";
import "../../styles/DashboardPage.css";

export default function DashboardPage() {
  const { token } = useRequireToken();

  const [topArtist, setTopArtist] = useState(null);
  const [topTrack, setTopTrack] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = buildTitle("Dashboard");
  }, []);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const artistsRes = await fetchUserTopArtists(token, 1);
        const tracksRes = await fetchUserTopTracks(token, 1);

        if (artistsRes.error) {
          setError(artistsRes.error);
          return;
        }
        if (tracksRes.error) {
          setError(tracksRes.error);
          return;
        }

        setTopArtist(artistsRes.data.items?.[0] ?? null);
        setTopTrack(tracksRes.data.items?.[0] ?? null);
      } catch (err) {
        setError(err.message ?? "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  return (
    <section className="dashboard page-container" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="page-title">Dashboard</h1>

      {loading && (
        <output data-testid="dashboard-loading" className="dashboard-loading">
          Loading dashboard…
        </output>
      )}

      {error && !loading && (
        <div className="dashboard-error" role="alert">
          Failed to load dashboard: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* 🎵 ARTISTE LE PLUS ÉCOUTÉ */}
          <h2 className="dashboard-subtitle">Most Listened Artist</h2>

          {topArtist ? (
            <SimpleCard
              image={topArtist.images?.[0]?.url}
              title={topArtist.name}
              subtitle={topArtist.genres?.join(", ") || "No genres available"}
            />
          ) : (
            <p>No top artist available.</p>
          )}

          {/* 🎶 MUSIQUE LA PLUS ÉCOUTÉE */}
          <h2 className="dashboard-subtitle">Most Listened Track</h2>

          {topTrack ? (
            <SimpleCard
              image={topTrack.album?.images?.[0]?.url}
              title={topTrack.name}
              subtitle={topTrack.artists?.map(a => a.name).join(", ")}
            />
          ) : (
            <p>No top track available.</p>
          )}
        </>
      )}
    </section>
  );
}
