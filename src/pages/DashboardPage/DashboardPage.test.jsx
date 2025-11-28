import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../DashboardPage/DashboardPage';
import * as spotifyApi from '../../api/spotify-me';
import { useRequireToken } from '../../hooks/useRequireToken';

// --- MOQUER LES DÉPENDANCES ---
jest.mock('../../api/spotify-me');
jest.mock('../../hooks/useRequireToken');

// --- DONNÉES DE MOCK ---
const mockArtist = {
  name: 'Mock Artist',
  id: 'a1',
  images: [{ url: 'artist-image-url' }],
  genres: ['pop', 'rock'],
};

const mockTrack = {
  name: 'Mock Track',
  id: 't1',
  album: { images: [{ url: 'track-image-url' }] },
  artists: [{ name: 'Track Performer' }],
};

describe('DashboardPage', () => {
  // Simuler un token valide
  beforeEach(() => {
    useRequireToken.mockReturnValue({ token: 'fake-token-123' });
    // Configurer un titre initial pour éviter les effets de bord
    document.title = 'Initial Title'; 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- SCÉNARIO 1 : AFFICHAGE DU CHARGEMENT ---
  test('devrait afficher "Loading" initialement', () => {
    // La promesse de l'API n'a pas encore été résolue, donc loading=true
    render(<DashboardPage />);
    expect(screen.getByText(/Loading dashboard…/i)).toBeInTheDocument();
  });

  // --- SCÉNARIO 2 : SUCCÈS (DONNÉES PRÉSENTES) ---
  test('devrait afficher l\'artiste et la piste après un chargement réussi', async () => {
    spotifyApi.fetchUserTopArtists.mockResolvedValue({ data: { items: [mockArtist] } });
    spotifyApi.fetchUserTopTracks.mockResolvedValue({ data: { items: [mockTrack] } });

    render(<DashboardPage />);
    
    // Attendre la résolution de l'API et la fin du chargement
    await waitFor(() => {
      // Couvre la branche de rendu principale et topArtist ? (...) et topTrack ? (...)
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Mock Artist')).toBeInTheDocument();
      expect(screen.getByText('Mock Track')).toBeInTheDocument();
      
      // Vérifier le sous-titre de l'artiste (couvre la branche topArtist.genres?.length)
      expect(screen.getByText('pop, rock')).toBeInTheDocument();
      
      // Vérifier le sous-titre de la piste
      expect(screen.getByText('Track Performer')).toBeInTheDocument();
    });

    // CORRECTION APPLIQUÉE ICI pour correspondre au format réel: "Dashboard | Music Discovery App"
    expect(document.title).toBe('Dashboard | Music Discovery App'); 
  });

  // --- SCÉNARIO 3 : PAS DE DONNÉES (COUVERTURE DES BLOCS ELSE) ---
  test('devrait afficher les messages "No data available" si l\'API renvoie des tableaux vides', async () => {
    // Simuler le succès des deux appels API avec des tableaux d'items vides
    spotifyApi.fetchUserTopArtists.mockResolvedValue({ data: { items: [] } });
    spotifyApi.fetchUserTopTracks.mockResolvedValue({ data: { items: [] } });

    render(<DashboardPage />);

    await waitFor(() => {
      // Couvre la branche else de l'artiste
      expect(screen.getByText('No artist data available.')).toBeInTheDocument();
      // Couvre la branche else de la piste
      expect(screen.getByText('No track data available.')).toBeInTheDocument();
    });
  });

  // --- SCÉNARIO 4 : ERREUR RÉSEAU/RÉSOLUTION (COUVERTURE DE CATCH) ---
  test('devrait afficher le message d\'erreur si fetchUserTopArtists échoue', async () => {
    const errorMsg = 'Failed to fetch artist data.';
    // Mock pour que la première fonction rejette une erreur (couvre le bloc catch)
    spotifyApi.fetchUserTopArtists.mockRejectedValue(new Error(errorMsg));
    spotifyApi.fetchUserTopTracks.mockResolvedValue({ data: { items: [] } }); // Mock nécessaire pour ne pas rejeter deux fois

    render(<DashboardPage />);

    await waitFor(() => {
      // Couvre le bloc if (error)
      expect(screen.getByRole('alert')).toHaveTextContent(`Error: ${errorMsg}`);
    });
  });

  // --- SCÉNARIO 5 : ERREUR OBJET DE RÉPONSE (COUVERTURE DU THROW) ---
  test('devrait afficher le message d\'erreur si la réponse de l\'API contient un objet error', async () => {
    // Mock pour que la fonction renvoie un objet d'erreur spécifique (couvre if (artistRes.error))
    spotifyApi.fetchUserTopArtists.mockResolvedValue({ error: 'Spotify rate limit exceeded' });
    spotifyApi.fetchUserTopTracks.mockResolvedValue({ data: { items: [] } });

    render(<DashboardPage />);

    await waitFor(() => {
      // Couvre le bloc if (error) après le throw
      expect(screen.getByRole('alert')).toHaveTextContent('Error: Spotify rate limit exceeded');
    });
  });
  
  // --- SCÉNARIO 6 : COUVERTURE DU SOUS-TITRE SANS GENRES ---
  test('devrait afficher "No genres available" si l\'artiste n\'a pas de genres', async () => {
    const artistWithoutGenres = { ...mockArtist, genres: [] };
    spotifyApi.fetchUserTopArtists.mockResolvedValue({ data: { items: [artistWithoutGenres] } });
    spotifyApi.fetchUserTopTracks.mockResolvedValue({ data: { items: [mockTrack] } });

    render(<DashboardPage />);

    await waitFor(() => {
      // Couvre la branche : 'No genres available'
      expect(screen.getByText('No genres available')).toBeInTheDocument();
      expect(screen.queryByText('pop, rock')).not.toBeInTheDocument();
    });
  });
});