
import { db as firestore, auth } from '../firebase';
import { authService } from './authService';
import { User } from '../types';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  serverTimestamp,
  onSnapshot,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';

// Helper to handle Firestore errors as per guidelines
const handleFirestoreError = (error: any, operation: string, path: string) => {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType: operation,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    }
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

export const db = {
    // User Methods
    getUsers: async (context?: 'dating' | 'adult'): Promise<User[]> => {
        try {
            const usersRef = collection(firestore, 'users');
            let q = query(usersRef, orderBy('role', 'desc'));
            
            if (context) {
                q = query(usersRef, where('contentPreference', '==', context), orderBy('role', 'desc'));
            }
            
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        } catch (error) {
            handleFirestoreError(error, 'list', 'users');
            return [];
        }
    },

    getUser: async (id: string): Promise<User | null> => {
        try {
            const userDoc = await getDoc(doc(firestore, 'users', id));
            if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() } as User;
            }
            return null;
        } catch (error) {
            handleFirestoreError(error, 'get', `users/${id}`);
            return null;
        }
    },

    getUserByUsername: async (username: string): Promise<User | null> => {
        try {
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('username', '==', username), limit(1));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                return { id: doc.id, ...doc.data() } as User;
            }
            return null;
        } catch (error) {
            handleFirestoreError(error, 'get', `users/username/${username}`);
            return null;
        }
    },

    createUser: async (id: string, userData: any) => {
        try {
            await setDoc(doc(firestore, 'users', id), {
                ...userData,
                joinedAt: serverTimestamp(),
                status: 'active',
                walletBalance: 0,
                role: userData.role || 'user'
            });
        } catch (error) {
            handleFirestoreError(error, 'create', `users/${id}`);
        }
    },

    updateUser: async (id: string, updates: any) => {
        try {
            await updateDoc(doc(firestore, 'users', id), updates);
        } catch (error) {
            handleFirestoreError(error, 'update', `users/${id}`);
        }
    },

    isFollowing: async (followerId: string, followingId: string) => {
        try {
            const q = query(
                collection(firestore, 'follows'),
                where('followerId', '==', followerId),
                where('followingId', '==', followingId)
            );
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            return false;
        }
    },

    followUser: async (followerId: string, followingId: string) => {
        try {
            const q = query(
                collection(firestore, 'follows'),
                where('followerId', '==', followerId),
                where('followingId', '==', followingId)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                // Unfollow
                const followDoc = snapshot.docs[0];
                await deleteDoc(doc(firestore, 'follows', followDoc.id));
                return false;
            } else {
                // Follow
                await addDoc(collection(firestore, 'follows'), {
                    followerId,
                    followingId,
                    timestamp: serverTimestamp()
                });
                return true;
            }
        } catch (error) {
            handleFirestoreError(error, 'write', 'follows');
            return false;
        }
    },

    updateWallet: async (userId: string, amount: number) => {
        try {
            const userRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const currentBalance = userDoc.data().walletBalance || 0;
                await updateDoc(userRef, { walletBalance: currentBalance + amount });
            }
        } catch (error) {
            handleFirestoreError(error, 'update', `users/${userId}/wallet`);
        }
    },

    // Content Methods
    getPosts: async (type?: string, category?: string) => {
        try {
            const postsRef = collection(firestore, 'posts');
            let q = query(postsRef, orderBy('timestamp', 'desc'), limit(50));
            
            if (type && type !== 'All') {
                q = query(postsRef, where('type', '==', type), orderBy('timestamp', 'desc'), limit(50));
            }
            
            if (category) {
                q = query(postsRef, where('category', '==', category), orderBy('timestamp', 'desc'), limit(50));
            }

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleFirestoreError(error, 'list', 'posts');
            return [];
        }
    },

    getPost: async (id: string) => {
        try {
            const postDoc = await getDoc(doc(firestore, 'posts', id));
            if (postDoc.exists()) {
                return { id: postDoc.id, ...postDoc.data() };
            }
            return null;
        } catch (error) {
            handleFirestoreError(error, 'get', `posts/${id}`);
            return null;
        }
    },

    getUserPosts: async (userId: string) => {
        try {
            const q = query(collection(firestore, 'posts'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    createPost: async (postData: any) => {
        try {
            const docRef = await addDoc(collection(firestore, 'posts'), {
                ...postData,
                timestamp: serverTimestamp(),
                heat: 0,
                comments: 0,
                views: 0
            });
            return docRef.id;
        } catch (error) {
            handleFirestoreError(error, 'create', 'posts');
        }
    },

    updatePost: async (id: string, updates: any) => {
        try {
            await updateDoc(doc(firestore, 'posts', id), updates);
        } catch (error) {
            handleFirestoreError(error, 'update', `posts/${id}`);
        }
    },

    deletePost: async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'posts', id));
        } catch (error) {
            handleFirestoreError(error, 'delete', `posts/${id}`);
        }
    },

    injectContent: async (content: any, type?: string) => {
        // This was likely used for mock data injection, we can just return it or save it
        return content;
    },

    // Leaderboard
    getLeaderboard: async (mode: string, time: string) => {
        // Simulate API call for now, as we don't have a real leaderboard collection yet
        await new Promise(r => setTimeout(r, 800));
        
        const mockItems = Array.from({ length: 20 }, (_, i) => ({
            id: `user-${i + 1}`,
            rank: i + 1,
            name: ['Darlene', 'Kyle', 'Arlene', 'Dianne', 'Aubrey', 'Jerome', 'Eleanor', 'Max', 'Luna', 'Felix'][Math.floor(Math.random() * 10)],
            handle: `@user${i + 1}`,
            score: Math.floor(Math.random() * 9000) + (20 - i) * 500,
            highScore: Math.floor(Math.random() * 200) + 50,
            avatar: `https://i.pravatar.cc/150?u=${mode}_${i + 10}`,
            isVerified: Math.random() > 0.7,
            type: mode === 'tags' ? 'TAG' : mode === 'intimacy' ? 'CIRCLE' : 'USER'
        }));

        const currentUser = authService.getCurrentUser();
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

    // Comments
    getComments: async (postId: string) => {
        try {
            const q = query(
                collection(firestore, 'comments'), 
                where('postId', '==', postId), 
                orderBy('timestamp', 'asc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleFirestoreError(error, 'list', 'comments');
            return [];
        }
    },

    addComment: async (commentData: any) => {
        try {
            await addDoc(collection(firestore, 'comments'), {
                ...commentData,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', 'comments');
        }
    },

    // Chat
    getChatRooms: (userId: string, callback: (rooms: any[]) => void) => {
        const q = query(
            collection(firestore, 'chatRooms'),
            where('participants', 'array-contains', userId),
            orderBy('lastMessageAt', 'desc')
        );
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => handleFirestoreError(error, 'list', 'chatRooms'));
    },

    getOrCreateChatRoom: async (participants: string[]) => {
        try {
            const roomsRef = collection(firestore, 'chatRooms');
            const q = query(roomsRef, where('participants', 'array-contains-any', participants));
            const snapshot = await getDocs(q);
            
            const existingRoom = snapshot.docs.find(doc => {
                const data = doc.data();
                return data.participants.length === participants.length && 
                       participants.every(p => data.participants.includes(p));
            });

            if (existingRoom) {
                return existingRoom.id;
            }

            const newRoom = await addDoc(roomsRef, {
                participants,
                createdAt: serverTimestamp(),
                lastMessage: '',
                lastMessageAt: serverTimestamp()
            });
            return newRoom.id;
        } catch (error) {
            handleFirestoreError(error, 'create', 'chatRooms');
        }
    },

    getMessages: (roomId: string, callback: (messages: any[]) => void) => {
        const q = query(
            collection(firestore, `chatRooms/${roomId}/messages`),
            orderBy('timestamp', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => handleFirestoreError(error, 'list', `chatRooms/${roomId}/messages`));
    },

    sendMessage: async (roomId: string, messageData: any) => {
        try {
            await addDoc(collection(firestore, `chatRooms/${roomId}/messages`), {
                ...messageData,
                timestamp: serverTimestamp()
            });
            await updateDoc(doc(firestore, 'chatRooms', roomId), {
                lastMessage: messageData.text,
                lastMessageAt: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', `chatRooms/${roomId}/messages`);
        }
    },

    // Trends
    getTrends: async (category: string = 'general') => {
        try {
            const q = query(
                collection(firestore, 'trends'),
                where('category', '==', category),
                orderBy('count', 'desc'),
                limit(10)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleFirestoreError(error, 'list', 'trends');
            return [];
        }
    },

    // Admin & Settings
    getRoles: async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'roles'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    getVerificationRequests: async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'verificationRequests'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    getLogs: async () => {
        try {
            const q = query(collection(firestore, 'logs'), orderBy('timestamp', 'desc'), limit(100));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    logAction: async (actionData: any) => {
        try {
            await addDoc(collection(firestore, 'logs'), {
                ...actionData,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Failed to log action:', error);
        }
    },

    getPendingApprovals: async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'pendingApprovals'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    addPendingApproval: async (data: any) => {
        try {
            await addDoc(collection(firestore, 'pendingApprovals'), {
                ...data,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', 'pendingApprovals');
        }
    },

    removePendingApproval: async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'pendingApprovals', id));
        } catch (error) {
            handleFirestoreError(error, 'delete', `pendingApprovals/${id}`);
        }
    },

    addSuggestion: async (suggestion: any) => {
        try {
            await addDoc(collection(firestore, 'suggestions'), {
                ...suggestion,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', 'suggestions');
        }
    },

    getBlogCategories: async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'blogCategories'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    addBlogCategory: async (category: any) => {
        try {
            await addDoc(collection(firestore, 'blogCategories'), category);
        } catch (error) {
            handleFirestoreError(error, 'create', 'blogCategories');
        }
    },

    removeBlogCategory: async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'blogCategories', id));
        } catch (error) {
            handleFirestoreError(error, 'delete', `blogCategories/${id}`);
        }
    },

    getArcadeConfig: async () => {
        try {
            const docSnap = await getDoc(doc(firestore, 'settings', 'arcade'));
            return docSnap.exists() ? docSnap.data() : {};
        } catch (error) {
            return {};
        }
    },

    addGameResult: async (result: any) => {
        try {
            await addDoc(collection(firestore, 'gameResults'), {
                ...result,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', 'gameResults');
        }
    },

    togglePrideTag: async (tag: string) => {
        // Logic for toggling pride tags
    },

    warnUser: async (userId: string, warning: any) => {
        try {
            await addDoc(collection(firestore, `users/${userId}/warnings`), {
                ...warning,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', `users/${userId}/warnings`);
        }
    },

    saveSiteSettings: async (settings: any) => {
        try {
            await setDoc(doc(firestore, 'settings', 'site'), settings, { merge: true });
        } catch (error) {
            handleFirestoreError(error, 'update', 'settings/site');
        }
    },

    savePointsSettings: async (settings: any) => {
        try {
            await setDoc(doc(firestore, 'settings', 'points'), settings, { merge: true });
        } catch (error) {
            handleFirestoreError(error, 'update', 'settings/points');
        }
    },

    saveApiSettings: async (settings: any) => {
        try {
            await setDoc(doc(firestore, 'settings', 'api'), settings, { merge: true });
        } catch (error) {
            handleFirestoreError(error, 'update', 'settings/api');
        }
    },

    saveCommunitySettings: async (settings: any) => {
        try {
            await setDoc(doc(firestore, 'settings', 'community'), settings, { merge: true });
        } catch (error) {
            handleFirestoreError(error, 'update', 'settings/community');
        }
    },

    getStreams: async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'streams'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    createChallenge: async (challenge: any) => {
        try {
            await addDoc(collection(firestore, 'challenges'), {
                ...challenge,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', 'challenges');
        }
    },

    removeVerificationRequest: async (id: string) => {
        try {
            await deleteDoc(doc(firestore, 'verificationRequests', id));
        } catch (error) {
            handleFirestoreError(error, 'delete', `verificationRequests/${id}`);
        }
    },

    createPromotion: async (promotion: any) => {
        try {
            await addDoc(collection(firestore, 'promotions'), {
                ...promotion,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            handleFirestoreError(error, 'create', 'promotions');
        }
    },

    getSuggestions: async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'suggestions'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    getReports: async (context?: string) => {
        try {
            const snapshot = await getDocs(collection(firestore, 'reports'));
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            return [];
        }
    },

    // Legacy/Mock fallbacks for non-critical features
    getCommunitySettings: () => ({ squooshLink: 'https://squoosh.app/' }),
    getPointsSettings: () => ({}),
    getSiteSettings: () => ({}),
    getApiSettings: () => ({}),
    getNotifications: () => [],
    getWallet: (userId: string) => ({ balance: 0 }),
    getWalletHistory: (userId: string) => [],
    getEarningsStats: (userId: string) => ({ totalEarnings: 0, pendingBalance: 0, availableBalance: 0, chartData: [] }),
    getGameHistory: () => [],
    getPromotions: () => [],
    getChallenges: () => [],
    getPrideTags: () => [],
    getUserLayout: (userId: string, containerId: string) => null,
    saveUserLayout: (userId: string, containerId: string, layout: any) => {},
};
