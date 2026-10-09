import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'database.sqlite');

export const sqlDb = new Database(dbPath);

// Initialize tables
sqlDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        displayName TEXT,
        role TEXT,
        status TEXT,
        joinedAt TEXT,
        avatarUrl TEXT,
        contentPreference TEXT,
        isPremium INTEGER,
        walletBalance REAL,
        isLuciStar INTEGER,
        isLuciStarPremium INTEGER
    );

    CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        type TEXT,
        title TEXT,
        content TEXT,
        thumbnailUrl TEXT,
        userId TEXT,
        heat INTEGER,
        comments INTEGER,
        views INTEGER,
        timestamp INTEGER,
        isAdult INTEGER,
        category TEXT,
        tags TEXT,
        pollData TEXT,
        price TEXT,
        FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        postId TEXT,
        userId TEXT,
        text TEXT,
        time TEXT,
        FOREIGN KEY(postId) REFERENCES posts(id),
        FOREIGN KEY(userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        senderId TEXT,
        receiverId TEXT,
        text TEXT,
        timestamp INTEGER,
        FOREIGN KEY(senderId) REFERENCES users(id),
        FOREIGN KEY(receiverId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS circles (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        avatarUrl TEXT,
        ownerId TEXT,
        membersCount INTEGER,
        FOREIGN KEY(ownerId) REFERENCES users(id)
    );
`);

// Seed initial data if empty
const userCount = sqlDb.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
    const insertUser = sqlDb.prepare(`
        INSERT INTO users (id, username, email, displayName, role, status, joinedAt, avatarUrl, contentPreference, isPremium, walletBalance, isLuciStar, isLuciStarPremium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('u_1', 'sarah_k', 'sarah@example.com', 'Sarah K', 'creator', 'active', '2023-01-15', 'https://picsum.photos/200?random=1', 'adult', 1, 1500, 0, 0);
    insertUser.run('u_2', 'john_doe', 'john@example.com', 'John Doe', 'user', 'active', '2023-02-20', 'https://picsum.photos/200?random=2', 'dating', 0, 100, 0, 0);
    insertUser.run('u_3', 'victoria_m', 'victoria@example.com', 'Victoria M', 'moderator', 'active', '2023-03-10', 'https://picsum.photos/200?random=3', 'adult', 1, 12000, 1, 0);
    insertUser.run('u_4', 'alex_g', 'alex@example.com', 'Alex G', 'creator', 'active', '2023-04-05', 'https://picsum.photos/200?random=4', 'dating', 1, 5000, 0, 1);

    const insertPost = sqlDb.prepare(`
        INSERT INTO posts (id, type, title, content, thumbnailUrl, userId, heat, comments, views, timestamp, isAdult, category, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPost.run('p_1', 'PHOTO', 'City Lights', 'Evening walk in the city.', 'https://picsum.photos/600/800?random=photo1', 'u_1', 420, 12, 100, Date.now(), 0, 'Photography', '["city", "night"]');
    insertPost.run('p_2', 'VIDEO', 'Weekend Trip', 'Exploring new places.', 'https://picsum.photos/800/450?random=video1', 'u_2', 1500, 45, 500, Date.now() - 10000, 0, 'Vlog', '["travel", "weekend"]');
    insertPost.run('p_3', 'SHORT', 'Quick Tip!', 'How to draw hands in 30s.', 'https://picsum.photos/400/700?random=short1', 'u_3', 800, 30, 200, Date.now() - 20000, 0, 'Art', '["drawing", "tutorial"]');
    insertPost.run('p_4', 'COMIC', 'The Void: Chapter 1', 'Start reading the new series now!', 'https://picsum.photos/400/600?random=comic1', 'u_4', 2200, 150, 1000, Date.now() - 30000, 0, 'Sci-Fi', '["comic", "scifi"]');
    
    const insertCircle = sqlDb.prepare(`
        INSERT INTO circles (id, name, description, avatarUrl, ownerId, membersCount)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertCircle.run('c_1', 'Neon Nights', 'Cyberpunk enthusiasts', 'https://picsum.photos/200?random=c1', 'u_1', 120);
    insertCircle.run('c_2', 'Art Collective', 'Share your creations', 'https://picsum.photos/200?random=c2', 'u_3', 450);
}

export const serverDb = {
    getUsers: () => sqlDb.prepare('SELECT * FROM users').all(),
    getUser: (id: string) => sqlDb.prepare('SELECT * FROM users WHERE id = ? OR username = ?').get(id, id),
    getTrendsByType: (type: string) => {
        const query = type === 'All' ? 'SELECT content FROM posts' : 'SELECT content FROM posts WHERE type = ?';
        const posts = (type === 'All' ? sqlDb.prepare(query).all() : sqlDb.prepare(query).all(type)) as { content: string }[];
        const tagCounts: Record<string, number> = {};
        
        posts.forEach(post => {
            const tags = post.content?.match(/#[a-zA-Z0-9_]+/g) || [];
            tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        const sortedTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag, count], index) => ({
                id: String(index + 1),
                tag,
                count: count > 1000 ? `${(count / 1000).toFixed(1)}K` : String(count),
                trend: count > 5 ? 'up' : 'stable',
                image: `https://picsum.photos/600/400?random=${type}_${index}`
            }));
            
        return sortedTags.length > 0 ? sortedTags : [
            { id: '1', tag: '#Welcome', count: '1', trend: 'up', image: `https://picsum.photos/600/400?random=${type}_0` }
        ];
    },
    getPosts: (limit = 10, offset = 0, type = 'All') => {
        let query = 'SELECT posts.*, users.username, users.displayName, users.avatarUrl as userAvatar FROM posts JOIN users ON posts.userId = users.id';
        const params: any[] = [];
        if (type !== 'All') {
            query += ' WHERE type = ?';
            params.push(type);
        }
        query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        return sqlDb.prepare(query).all(...params).map((p: any) => ({
            ...p,
            user: { username: p.username, displayName: p.displayName, avatarUrl: p.userAvatar },
            tags: p.tags ? JSON.parse(p.tags) : [],
            pollData: p.pollData ? JSON.parse(p.pollData) : null
        }));
    },
    createPost: (post: any) => {
        const id = `p_${Date.now()}`;
        const stmt = sqlDb.prepare(`
            INSERT INTO posts (id, type, title, content, thumbnailUrl, userId, heat, comments, views, timestamp, isAdult, category, tags, pollData, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            id, post.type, post.title, post.content, post.thumbnailUrl, post.userId, 
            0, 0, 0, Date.now(), post.isAdult ? 1 : 0, post.category, 
            JSON.stringify(post.tags || []), JSON.stringify(post.pollData || null), post.price
        );
        return { ...post, id };
    },
    getComments: (postId: string) => {
        return sqlDb.prepare('SELECT comments.*, users.username, users.displayName, users.avatarUrl as userAvatar FROM comments JOIN users ON comments.userId = users.id WHERE postId = ? ORDER BY time DESC').all(postId).map((c: any) => ({
            ...c,
            user: { username: c.username, displayName: c.displayName, avatarUrl: c.userAvatar }
        }));
    },
    addComment: (postId: string, userId: string, text: string) => {
        const id = `c_${Date.now()}`;
        sqlDb.prepare('INSERT INTO comments (id, postId, userId, text, time) VALUES (?, ?, ?, ?, ?)').run(id, postId, userId, text, new Date().toISOString());
        sqlDb.prepare('UPDATE posts SET comments = comments + 1 WHERE id = ?').run(postId);
        return { id, postId, userId, text, time: new Date().toISOString() };
    },
    getChatMessages: (userId1: string, userId2: string) => {
        return sqlDb.prepare(`
            SELECT * FROM chat_messages 
            WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
            ORDER BY timestamp ASC
        `).all(userId1, userId2, userId2, userId1);
    },
    addChatMessage: (senderId: string, receiverId: string, text: string) => {
        const id = `msg_${Date.now()}`;
        const timestamp = Date.now();
        sqlDb.prepare('INSERT INTO chat_messages (id, senderId, receiverId, text, timestamp) VALUES (?, ?, ?, ?, ?)').run(id, senderId, receiverId, text, timestamp);
        return { id, senderId, receiverId, text, timestamp };
    },
    getCircles: () => sqlDb.prepare('SELECT * FROM circles').all(),
    getUserPosts: (userId: string) => {
        return sqlDb.prepare('SELECT * FROM posts WHERE userId = ? ORDER BY timestamp DESC').all(userId);
    },
    getSiteSettings: () => ({})
};
