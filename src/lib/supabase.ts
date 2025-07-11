import { createClient } from '@supabase/supabase-js';

// Debug environment variables

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjkxuozeqkblmkvbgkso.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqa3h1b3plcWtibG1rdmJna3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjM5MDEsImV4cCI6MjA2NTAzOTkwMX0.yDPWqNdjqJwjnykeEX6hAS2NP2zKzQxr3O_cgmv6xmk'
); 

