
import { authService } from './authService';

export interface LeaderboardMember {
    id: string;
    rank: number;
    name: string;
    handle?: string;
    score: number;
    highScore: number;
    avatar?: string;
    isVerified?: boolean;
    type: 'USER' | 'TAG' | 'CIRCLE' | 'GAME';
}

export const leaderboardService = {
    async getRankings(mode: string, timeFilter: string = 'monthly'): Promise<LeaderboardMember[]> {
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        
        const currentUser = authService.getCurrentUser();

        const mockItems: LeaderboardMember[] = Array.from({ length: 20 }, (_, i) => {
            let name = ['Darlene', 'Kyle', 'Arlene', 'Dianne', 'Aubrey', 'Jerome', 'Eleanor', 'Max', 'Luna', 'Felix'][Math.floor(Math.random() * 10)];
            if (mode === 'users' || mode === 'intimacy' || mode === 'tags') {
                name = `#${['gaming', 'art', 'music', 'tech', 'sports', 'food', 'travel', 'fashion', 'movies', 'books'][Math.floor(Math.random() * 10)]}`;
            } else if (mode === 'arcade') {
                name = ['Pac-Man', 'Tetris', 'Space Invaders', 'Donkey Kong', 'Galaga', 'Street Fighter', 'Mortal Kombat', 'Asteroids', 'Centipede', 'Frogger'][Math.floor(Math.random() * 10)];
            }

            return {
                id: `item-${i + 1}`,
                rank: i + 1,
                name,
                handle: mode === 'arcade' ? undefined : `@user${i + 1}`,
                score: Math.floor(Math.random() * 9000) + (20 - i) * 500,
                highScore: Math.floor(Math.random() * 200) + 50,
                avatar: `https://i.pravatar.cc/150?u=${mode}_${i + 10}`,
                isVerified: Math.random() > 0.7,
                type: mode === 'tags' ? 'TAG' : mode === 'intimacy' ? 'CIRCLE' : mode === 'arcade' ? 'GAME' : 'USER'
            };
        });

        // Add current user at rank 25 if not in top 20
        if (currentUser && mode === 'users') {
            mockItems.push({
                id: currentUser.id,
                rank: 25,
                name: currentUser.displayName || 'You',
                handle: `@${currentUser.username}`,
                score: 4152,
                highScore: 156,
                avatar: currentUser.avatarUrl,
                isVerified: currentUser.isVerified,
                type: 'USER'
            });
        }

        return mockItems.sort((a, b) => a.rank - b.rank);
    },

    async getSectionResults(): Promise<Record<string, LeaderboardMember[]>> {
        await new Promise(r => setTimeout(r, 500));
        const sections = ['intimacy', 'users', 'tags', 'arcade'];
        const results: Record<string, LeaderboardMember[]> = {};
        
        sections.forEach(sec => {
            results[sec] = Array.from({ length: 3 }, (_, i) => {
                let name = ['Darlene', 'Kyle', 'Arlene', 'Dianne', 'Aubrey', 'Jerome', 'Eleanor', 'Max', 'Luna', 'Felix'][Math.floor(Math.random() * 10)];
                if (sec === 'users' || sec === 'intimacy' || sec === 'tags') {
                    name = `#${['gaming', 'art', 'music', 'tech', 'sports', 'food', 'travel', 'fashion', 'movies', 'books'][Math.floor(Math.random() * 10)]}`;
                } else if (sec === 'arcade') {
                    name = ['Pac-Man', 'Tetris', 'Space Invaders', 'Donkey Kong', 'Galaga', 'Street Fighter', 'Mortal Kombat', 'Asteroids', 'Centipede', 'Frogger'][Math.floor(Math.random() * 10)];
                }

                return {
                    id: `${sec}-${i + 1}`,
                    rank: i + 1,
                    name,
                    handle: sec === 'arcade' ? undefined : `@${sec}_${i + 1}`,
                    score: Math.floor(Math.random() * 9000) + (3 - i) * 1000,
                    highScore: Math.floor(Math.random() * 200) + 50,
                    avatar: `https://i.pravatar.cc/150?u=${sec}_${i + 10}`,
                    isVerified: Math.random() > 0.7,
                    type: sec === 'tags' ? 'TAG' : sec === 'intimacy' ? 'CIRCLE' : sec === 'arcade' ? 'GAME' : 'USER'
                };
            });
        });
        return results;
    }
};
