
import { User } from '../types';
import { db } from './db';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const USER_KEY = 'cv_user';
const TOKEN_KEY = 'cv_token';
const ADMIN_TOKEN_KEY = 'cv_admin_token';

export const authService = {
    loginWithGoogle: async (): Promise<User> => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        const isAdminUser = fbUser.email === 'blackwhistledrug@gmail.com';

        let existingUser: any = await db.getUser(fbUser.uid);
        if (!existingUser && fbUser.email) {
            existingUser = await db.getUserByUsername(fbUser.email.split('@')[0]);
        }

        const username = fbUser.email ? fbUser.email.split('@')[0] : `user_${fbUser.uid.slice(0, 6)}`;
        const userObj: User = {
            id: fbUser.uid,
            uid: fbUser.uid,
            username: existingUser?.username || username,
            displayName: fbUser.displayName || existingUser?.displayName || username,
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || existingUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || username)}&background=ef4444&color=fff`,
            isVerified: true,
            followers: existingUser?.followers || 0,
            isPremium: true,
            isAdmin: isAdminUser || existingUser?.isAdmin || existingUser?.role === 'admin',
            role: (isAdminUser || existingUser?.role === 'admin') ? 'admin' : (existingUser?.role || 'creator'),
            coins: existingUser?.coins || 1000,
            contentPreference: existingUser?.contentPreference || 'dating',
            interests: existingUser?.interests || ['Portrait', 'Landscape']
        };

        if (userObj.isAdmin) {
            localStorage.setItem(ADMIN_TOKEN_KEY, 'admin_secret_token');
        } else {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
        }
        localStorage.setItem(TOKEN_KEY, 'google_auth_token');
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));

        try {
            await db.createUser(userObj.id, userObj);
        } catch (e) {
            console.log("User synced with local state:", e);
        }

        return userObj;
    },

    login: async (identifier: string, password: string): Promise<User> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Admin Credentials
        if (identifier === 'admin' && password === 'admin') {
            const adminUser: User = {
                id: '1002',
                username: 'admin',
                displayName: 'System Admin',
                avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff',
                isVerified: true,
                followers: 0,
                isPremium: true,
                isAdmin: true,
                role: 'admin',
                coins: 0,
                contentPreference: 'dating'
            };
            localStorage.setItem(ADMIN_TOKEN_KEY, 'admin_secret_token');
            localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
            return adminUser;
        }

        // Search for user in database
        const existingUser: any = await db.getUser(identifier);
        
        if (existingUser) {
            localStorage.setItem(TOKEN_KEY, 'user_mock_token');
            // Ensure default pref
            if (!existingUser.contentPreference) existingUser.contentPreference = 'dating';
            localStorage.setItem(USER_KEY, JSON.stringify(existingUser));
            if (existingUser.role === 'admin') localStorage.setItem(ADMIN_TOKEN_KEY, 'admin_secret_token');
            return existingUser as unknown as User;
        }

        if (identifier === 'fail') throw new Error('Invalid credentials');

        // Fallback mock
        const normalUser: User = {
            id: 'u1',
            uid: 'u1', // Sync with id for rules
            username: 'creativesoul',
            displayName: 'Creative Soul',
            avatarUrl: 'https://picsum.photos/200/200',
            isVerified: true,
            followers: 12500,
            isPremium: true, // Mocked as LuciStar status
            isAdmin: false, 
            role: 'creator',
            coins: 1250,
            contentPreference: 'dating',
            interests: ['Portrait', 'Landscape', 'Nature']
        };
        
        localStorage.setItem(TOKEN_KEY, 'user_mock_token');
        localStorage.setItem(USER_KEY, JSON.stringify(normalUser));
        return normalUser;
    },

    updateContentPreference: (mode: 'dating' | 'adult') => {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return;
        try {
            const user = JSON.parse(userStr);
            user.contentPreference = mode;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            // Update in mock DB too
            db.updateUser(user.id, { contentPreference: mode });
        } catch (e) {
            console.error("Failed to update preference", e);
        }
    },

    updatePimpSettings: (settings: { profitPercent?: number, mandatorySubscription?: { name: string, fee: number, active: boolean } }) => {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return;
        try {
            const user = JSON.parse(userStr);
            user.pimpSettings = {
                ...user.pimpSettings,
                ...settings
            };
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            db.updateUser(user.id, { pimpSettings: user.pimpSettings });
        } catch (e) {
            console.error("Failed to update pimp settings", e);
        }
    },

    logout: () => {
        try {
            signOut(auth).catch(() => {});
        } catch {
            // ignore if not signed in to firebase
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('creatorverse_auth');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;
        try {
            const user = JSON.parse(userStr);
            // Ensure default
            if (!user.contentPreference) user.contentPreference = 'dating';
            return user;
        } catch {
            return null;
        }
    },

    isAdmin: (): boolean => {
        return !!localStorage.getItem(ADMIN_TOKEN_KEY);
    }
};
