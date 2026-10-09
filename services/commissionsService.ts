export interface Commission {
  id: number;
  title: string;
  artist: { username: string; avatar: string };
  price: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  image: string;
  tags: string[];
  category: string;
}

const mockCommissions: Commission[] = [
  {
    id: 1,
    title: 'Custom Character Illustration',
    artist: { username: 'User 1', avatar: 'https://picsum.photos/100/100?random=1' },
    price: 50,
    rating: 4.9,
    reviews: 128,
    deliveryTime: '3-5 days',
    image: 'https://picsum.photos/400/300?random=1',
    tags: ['Illustration', 'Character Design'],
    category: 'Digital Art'
  },
  {
    id: 2,
    title: 'Twitch Emotes & Badges',
    artist: { username: 'User 2', avatar: 'https://picsum.photos/100/100?random=2' },
    price: 25,
    rating: 4.8,
    reviews: 84,
    deliveryTime: '1-2 days',
    image: 'https://picsum.photos/400/300?random=2',
    tags: ['Emotes', 'Twitch'],
    category: 'Digital Art'
  },
  {
    id: 3,
    title: 'Concept Art Landscape',
    artist: { username: 'User 3', avatar: 'https://picsum.photos/100/100?random=3' },
    price: 120,
    rating: 5.0,
    reviews: 42,
    deliveryTime: '7-10 days',
    image: 'https://picsum.photos/400/300?random=3',
    tags: ['Concept Art', 'Landscape'],
    category: 'Digital Art'
  }
];

export const commissionsService = {
  getCommissions: async (): Promise<Commission[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCommissions), 800);
    });
  },
  searchCommissions: async (query: string): Promise<Commission[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        resolve(mockCommissions.filter(c => c.title.toLowerCase().includes(lowerQuery) || c.tags.some(t => t.toLowerCase().includes(lowerQuery))));
      }, 500);
    });
  }
};
