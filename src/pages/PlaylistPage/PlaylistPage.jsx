// src/pages/PlaylistPage/PlaylistPage.jsx

import { useParams } from 'react-router-dom';

export default function PlaylistPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Playlist Detail Page</h1>
      <p>Playlist ID: {id}</p>
    </div>
  );
}
