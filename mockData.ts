export const trending = Array.from({ length: 1000 }, (_, i) => ({
    id: `t_${i}`,
    tag: `#Trend${i}`,
    count: `${Math.floor(Math.random() * 100)}K`,
    trend: Math.random() > 0.5 ? 'up' : 'stable',
    image: `https://picsum.photos/600/400?random=${i}`
}));

export const topMuses = Array.from({ length: 1000 }, (_, i) => ({
    id: `m_${i}`,
    username: `muse_${i}`,
    displayName: `Muse ${i}`,
    avatarUrl: `https://picsum.photos/200?random=m${i}`,
    followers: Math.floor(Math.random() * 1000000)
}));
