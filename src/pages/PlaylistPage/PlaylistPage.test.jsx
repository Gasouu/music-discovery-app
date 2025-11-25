// src/pages/PlaylistPage/PlaylistPage.test.jsx

import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import PlaylistPage from './PlaylistPage.jsx';
import * as spotifyApi from '../../api/spotify-playlists.js';
import * as handleTokenErrorModule from '../../utils/handleTokenError.js';

import { KEY_ACCESS_TOKEN } from '../../constants/storageKeys.js';

const playlistData = {
    id: 'playlist1',
    name: 'My Playlist 1',
    description: 'A cool playlist',
    images: [{ url: 'https://via.placeholder.com/56' }],
    owner: { display_name: 'User1' },
    external_urls: { spotify: 'https://open.spotify.com/playlist/playlist1' },
    tracks: {
        items: [
            {
                track: {
                    id: 'track1',
                    name: 'Track One',
                    artists: [{ name: 'Artist A' }],
                    album: { name: 'Album X', images: [{ url: 'https://via.placeholder.com/56' }] },
                    duration_ms: 210000,
                    external_urls: { spotify: 'https://open.spotify.com/track/track1' },
                },
            },
        ],
    },
};

describe('PlaylistPage', () => {
    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'getItem')
            .mockImplementation((key) => key === KEY_ACCESS_TOKEN ? 'test-token' : null);

        jest.spyOn(spotifyApi, 'fetchPlaylistById')
            .mockResolvedValue({ data: playlistData, error: null });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('fetches and renders playlist, sets title', async () => {
        render(
            <MemoryRouter initialEntries={['/playlist/playlist1']}>
                <Routes>
                    <Route path="/playlist/:id" element={<PlaylistPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
        });

        expect(document.title).toBe("Playlist | Music Discovery App");

        expect(await screen.findByRole('heading', { level: 1, name: playlistData.name }))
            .toBeInTheDocument();
    });

    test('handles token expiration', async () => {
        // 👉 IMPORTANT : pas de variable 'spy', sinon ESLint échoue
        jest.spyOn(handleTokenErrorModule, "handleTokenError");

        jest.spyOn(spotifyApi, "fetchPlaylistById")
            .mockResolvedValue({ data: null, error: "The access token expired" });

        render(
            <MemoryRouter initialEntries={['/playlist/playlist1']}>
                <Routes>
                    <Route path="/playlist/:id" element={<PlaylistPage />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(handleTokenErrorModule.handleTokenError).toHaveBeenCalled();
        });
    });
});

