const { createClient } = require('@supabase/supabase-js');
const { nanoid } = require('nanoid');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjkxuozeqkblmkvbgkso.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa3h1b3plcWtibG1rdmJna3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjM5MDEsImV4cCI6MjA2NTAzOTkwMX0.yDPWqNdjqJwjnykeEX6hAS2NP2zKzQxr3O_cgmv6xmk'
);

async function seedData() {
    try {
        // Create sample users
        const users = [
            { id: 'user1', name: 'john_doe', email: 'john@example.com', email_verified: true },
            { id: 'user2', name: 'jane_smith', email: 'jane@example.com', email_verified: true },
            { id: 'user3', name: 'reddit_user', email: 'user@example.com', email_verified: true }
        ];

        for (const user of users) {
            await supabase.from('user').upsert(user);
        }

        // Create sample communities
        const communities = [
            { id: 'comm1', name: 'technology', user_id: 'user1', instructions: 'Tech discussions' },
            { id: 'comm2', name: 'programming', user_id: 'user2', instructions: 'Programming help' },
            { id: 'comm3', name: 'webdev', user_id: 'user3', instructions: 'Web development' }
        ];

        for (const community of communities) {
            await supabase.from('community').upsert(community);
        }

        // Create sample posts
        const posts = [
            {
                id: 'post1',
                title: 'Welcome to our Reddit Clone!',
                content: 'This is the first post in our new Reddit-like platform. Feel free to vote and comment!',
                user_id: 'user1',
                community_id: 'comm1',
                upvotes: 15,
                downvotes: 2
            },
            {
                id: 'post2',
                title: 'How to learn React in 2024?',
                content: 'Looking for the best resources to learn React. Any recommendations?',
                user_id: 'user2',
                community_id: 'comm2',
                upvotes: 8,
                downvotes: 1
            },
            {
                id: 'post3',
                title: 'Check out this cool website',
                url: 'https://example.com',
                user_id: 'user3',
                community_id: 'comm3',
                upvotes: 5,
                downvotes: 0
            }
        ];

        for (const post of posts) {
            await supabase.from('posts').upsert(post);
        }

        // Create sample comments
        const comments = [
            {
                id: 'comment1',
                content: 'Great post! Thanks for sharing.',
                user_id: 'user2',
                post_id: 'post1',
                upvotes: 3,
                downvotes: 0
            },
            {
                id: 'comment2',
                content: 'I recommend starting with the official React docs.',
                user_id: 'user1',
                post_id: 'post2',
                upvotes: 5,
                downvotes: 0
            },
            {
                id: 'comment3',
                content: 'Nice find! This website has great content.',
                user_id: 'user1',
                post_id: 'post3',
                upvotes: 2,
                downvotes: 0
            }
        ];

        for (const comment of comments) {
            await supabase.from('comments').upsert(comment);
        }

        console.log('✅ Sample data seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

seedData();