
import { db } from './db';
import { authService } from './authService';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

interface PaginatedResponse<T> {
    items: T[];
    nextCursor?: string;
}

export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const [pathString, queryString] = endpoint.split('?');
        const params = new URLSearchParams(queryString);
        const limit = parseInt(params.get('limit') || '10'); 
        const cursor = params.get('cursor') || undefined;
        const type = params.get('type') || 'All';
        const category = params.get('category') || undefined;
        
        const user = authService.getCurrentUser();
        const preference = user?.contentPreference || 'dating';

        if (pathString === '/trends/hashtags') {
            return (await db.getTrends('general')) as unknown as T;
        }
        
        if (pathString === '/trends/tags') {
            const section = params.get('section') || 'general';
            return (await db.getTrends(section)) as unknown as T;
        }

        if (pathString === '/feed') {
            const items = await db.getPosts(type === 'All' ? undefined : type, category);
            return { items, nextCursor: undefined } as unknown as T;
        }

        if (pathString === '/notifications') {
            return db.getNotifications() as unknown as T;
        }

        if (pathString === '/wallet') {
            return db.getWallet(user?.id || '') as unknown as T;
        }

        if (pathString === '/wallet/history') {
            return db.getWalletHistory(user?.id || '') as unknown as T;
        }

        if (pathString === '/earnings/stats') {
            return db.getEarningsStats(user?.id || '') as unknown as T;
        }

        if (pathString.match(/\/users\/([^/]+)\/posts/)) {
            const userMatch = pathString.match(/\/users\/([^/]+)\/posts/);
            const userId = userMatch ? userMatch[1] : '';
            // For now, getPosts doesn't filter by user, but we could add it
            const items = await db.getPosts(); 
            return (Array.isArray(items) ? items.filter((p: any) => p.userId === userId) : []) as unknown as T;
        }

        if (pathString.match(/\/users\/([^/?]+)/)) {
            const userMatch = pathString.match(/\/users\/([^/?]+)/);
            const userIdOrUsername = userMatch ? userMatch[1] : '';
            
            // Try to get by ID first
            let user = await db.getUser(userIdOrUsername);
            
            // If not found, try to get by username
            if (!user) {
                user = await db.getUserByUsername(userIdOrUsername);
            }
            
            return user as unknown as T;
        }

        if (pathString.match(/\/posts\/([^/]+)\/comments/)) {
            const match = pathString.match(/\/posts\/([^/]+)\/comments/);
            const postId = match ? match[1] : '';
            return (await db.getComments(postId)) as unknown as T;
        }

        if (pathString.match(/\/posts\/([^/]+)/)) {
            const match = pathString.match(/\/posts\/([^/]+)/);
            const postId = match ? match[1] : '';
            return (await db.getPost(postId)) as unknown as T;
        }

        if (pathString === '/leaderboard') {
            const mode = params.get('mode') || 'users';
            const time = params.get('time') || 'monthly';
            return (await db.getLeaderboard(mode, time)) as unknown as T;
        }

        return null as unknown as T;
    },

    post: async <T>(endpoint: string, body: any): Promise<T> => {
        if (endpoint === '/posts') {
            return (await db.createPost(body)) as unknown as T;
        }
        if (endpoint.match(/\/posts\/(\d+)\/comments/)) {
            const match = endpoint.match(/\/posts\/(\d+)\/comments/);
            const postId = match ? match[1] : '';
            return (await db.addComment({ ...body, postId })) as unknown as T;
        }
        return null as unknown as T;
    },

    patch: async <T>(endpoint: string, body: any): Promise<T> => {
        if (endpoint.match(/\/users\/([^/]+)/)) {
            const match = endpoint.match(/\/users\/([^/]+)/);
            const userId = match ? match[1] : '';
            return (await db.updateUser(userId, body)) as unknown as T;
        }
        return null as unknown as T;
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        if (endpoint.match(/\/posts\/([^/]+)/)) {
            const match = endpoint.match(/\/posts\/([^/]+)/);
            const postId = match ? match[1] : '';
            return (await db.deletePost(postId)) as unknown as T;
        }
        return null as unknown as T;
    }
};
