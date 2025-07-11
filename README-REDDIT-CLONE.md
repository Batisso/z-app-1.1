# Reddit Clone

This is a Reddit clone built with Next.js, Supabase, and tRPC. It features a modern responsive UI that looks and feels like Reddit.

## Features

- **Post Creation**: Create new posts in different communities
- **Voting System**: Upvote and downvote posts and comments
- **Comment Threads**: Nested comment threads with voting
- **User Communities/Subreddits**: Browse and filter by communities
- **Feed with Sorting Options**: Sort by hot, new, or top
- **Modern Responsive UI**: Clean and responsive design that works on all devices

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the database migrations:
   ```bash
   npm run db:push
   ```
5. Seed the database with sample data:
   ```bash
   node scripts/seed-reddit-data.js
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The Reddit clone uses the following database tables:

- **community**: Represents subreddits/communities
- **posts**: Contains all posts with title, content, and voting data
- **comments**: Stores comments with support for nested replies
- **votes**: Tracks user votes on posts and comments

## Architecture

- **Frontend**: Next.js with React 19
- **UI Components**: Shadcn UI components
- **State Management**: React Query with tRPC
- **Backend**: tRPC procedures with Supabase
- **Database**: PostgreSQL via Supabase

## Future Improvements

- User authentication and profiles
- Rich text editor for posts and comments
- Image and media uploads
- Notifications
- Search functionality
- Mobile app with React Native