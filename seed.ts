import { sqlDb } from './server-db.ts';

const generateData = () => {
    console.log('Seeding database...');
    
    // Users
    const insertUser = sqlDb.prepare(`
        INSERT INTO users (id, username, email, displayName, role, status, joinedAt, avatarUrl, contentPreference, isPremium, walletBalance, isLuciStar, isLuciStarPremium)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (let i = 0; i < 1000; i++) {
        insertUser.run(
            `u_gen_${i}`, 
            `user_${i}`, 
            `user_${i}@example.com`, 
            `User ${i}`, 
            'user', 
            'active', 
            '2023-01-01', 
            `https://picsum.photos/200?random=${i}`, 
            'dating', 
            0, 
            100, 
            0, 
            0
        );
    }
    console.log('Inserted 1000 users');

    // Circles
    const insertCircle = sqlDb.prepare(`
        INSERT INTO circles (id, name, description, avatarUrl, ownerId, membersCount)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (let i = 0; i < 1000; i++) {
        insertCircle.run(
            `c_gen_${i}`, 
            `Circle ${i}`, 
            `Description for circle ${i}`, 
            `https://picsum.photos/200?random=c${i}`, 
            `u_gen_${i % 1000}`, 
            Math.floor(Math.random() * 1000)
        );
    }
    console.log('Inserted 1000 circles');

    // Posts
    const insertPost = sqlDb.prepare(`
        INSERT INTO posts (id, type, title, content, thumbnailUrl, userId, heat, comments, views, timestamp, isAdult, category, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (let i = 0; i < 1000; i++) {
        insertPost.run(
            `p_gen_${i}`, 
            'PHOTO', 
            `Post ${i}`, 
            `Content for post ${i} #tag${i}`, 
            `https://picsum.photos/600/800?random=${i}`, 
            `u_gen_${i % 1000}`, 
            Math.floor(Math.random() * 1000),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 10000),
            Date.now(),
            0,
            'General',
            JSON.stringify([`tag${i}`])
        );
    }
    console.log('Inserted 1000 posts');
    console.log('Seeding complete.');
};

generateData();
