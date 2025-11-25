// src/components/PlayListItem.test.jsx

import { describe, expect, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlayListItem from './PlayListItem';

describe('PlayListItem component', () => {
    test('renders playlist information correctly and links to detail page', () => {
        // Arrange
        const playlist = {
            id: 'playlist1',
            name: 'Test Playlist',
            images: [{ url: 'test.jpg' }],
            owner: { display_name: 'Test Owner' },
            tracks: { total: 15 },
            external_urls: { spotify: 'https://open.spotify.com/playlist/playlist1' }
        };

        // Act
        render(
            <MemoryRouter>
                <PlayListItem playlist={playlist} />
            </MemoryRouter>
        );

        // Assert
        const item = screen.getByTestId(`playlist-item-${playlist.id}`);
        expect(item).toBeInTheDocument();

        // Image
        expect(screen.getByAltText('cover')).toHaveAttribute('src', playlist.images[0].url);

        // Texts
        expect(screen.getByText(playlist.name)).toBeInTheDocument();
        expect(screen.getByText(`By ${playlist.owner.display_name}`)).toBeInTheDocument();
        expect(screen.getByText(`${playlist.tracks.total} tracks`)).toBeInTheDocument();

        // NEW BEHAVIOR: now links to /playlist/:id
        const link = screen.getByRole('link');

        expect(link).toHaveAttribute('href', `/playlist/${playlist.id}`);
    });
});
