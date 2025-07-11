// Migration script to move localStorage data to Supabase
// Run this in the browser console on your app to migrate existing data

async function migrateLocalStorageToSupabase() {
  console.log('Starting migration from localStorage to Supabase...');
  
  // Check if we have access to the supabase client
  if (typeof window === 'undefined' || !window.supabase) {
    console.error('Supabase client not available. Make sure you are running this on your app page.');
    return;
  }
  
  const supabase = window.supabase;
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      return;
    }
    
    console.log('Authenticated user:', user.id);
    
    // 1. Migrate Communities
    const localCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
    console.log(`Found ${localCommunities.length} communities in localStorage`);
    
    for (const community of localCommunities) {
      try {
        const { data, error } = await supabase
          .from('community')
          .upsert({
            id: community.id,
            name: community.name,
            slug: community.slug || community.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            instructions: community.instructions || '',
            image: community.image || null,
            url: community.url || null,
            user_id: community.userId || user.id,
            created_at: community.createdAt || new Date().toISOString(),
            updated_at: community.updatedAt || new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error(`Error migrating community ${community.name}:`, error);
        } else {
          console.log(`✓ Migrated community: ${community.name}`);
        }
      } catch (err) {
        console.error(`Failed to migrate community ${community.name}:`, err);
      }
    }
    
    // 2. Migrate Posts
    const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    console.log(`Found ${localPosts.length} posts in localStorage`);
    
    for (const post of localPosts) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .upsert({
            id: post.id,
            title: post.title,
            content: post.content || null,
            url: post.url || null,
            image: post.image || null,
            tags: post.tags || [],
            community_id: post.communityId,
            user_id: post.userId || user.id,
            author: post.author || 'Unknown',
            author_image: post.authorImage || '',
            community_name: post.communityName || 'Unknown',
            upvotes: post.upvotes || 0,
            downvotes: post.downvotes || 0,
            liked_by: post.likedBy || [],
            created_at: post.createdAt || new Date().toISOString(),
            updated_at: post.updatedAt || new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error(`Error migrating post ${post.title}:`, error);
        } else {
          console.log(`✓ Migrated post: ${post.title}`);
        }
      } catch (err) {
        console.error(`Failed to migrate post ${post.title}:`, err);
      }
    }
    
    // 3. Migrate Comments
    const localComments = JSON.parse(localStorage.getItem('comments') || '[]');
    console.log(`Found ${localComments.length} comments in localStorage`);
    
    for (const comment of localComments) {
      try {
        const { data, error } = await supabase
          .from('comments')
          .upsert({
            id: comment.id,
            content: comment.content,
            post_id: comment.postId,
            parent_id: comment.parentId || null,
            user_id: comment.userId || user.id,
            author: comment.author || 'Unknown',
            author_image: comment.authorImage || '',
            upvotes: comment.upvotes || 0,
            downvotes: comment.downvotes || 0,
            created_at: comment.createdAt || new Date().toISOString(),
            updated_at: comment.updatedAt || new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error(`Error migrating comment:`, error);
        } else {
          console.log(`✓ Migrated comment: ${comment.content.substring(0, 50)}...`);
        }
      } catch (err) {
        console.error(`Failed to migrate comment:`, err);
      }
    }
    
    // 4. Migrate Joined Communities
    const localJoinedCircles = JSON.parse(localStorage.getItem(`joinedCircles_${user.id}`) || '[]');
    console.log(`Found ${localJoinedCircles.length} joined circles in localStorage`);
    
    for (const communityId of localJoinedCircles) {
      try {
        const { data, error } = await supabase
          .from('community_members')
          .upsert({
            id: Math.random().toString(36).substring(2, 15),
            user_id: user.id,
            community_id: communityId,
            joined_at: new Date().toISOString()
          })
          .select();
        
        if (error) {
          console.error(`Error migrating joined community ${communityId}:`, error);
        } else {
          console.log(`✓ Migrated joined community: ${communityId}`);
        }
      } catch (err) {
        console.error(`Failed to migrate joined community ${communityId}:`, err);
      }
    }
    
    console.log('Migration completed successfully!');
    console.log('You can now safely clear your localStorage or keep it as backup.');
    console.log('To clear localStorage, run:');
    console.log('localStorage.removeItem("communities");');
    console.log('localStorage.removeItem("posts");');
    console.log('localStorage.removeItem("comments");');
    console.log(`localStorage.removeItem("joinedCircles_${user.id}");`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Function to clear localStorage after successful migration
function clearLocalStorageData(userId) {
  if (confirm('Are you sure you want to clear all localStorage data? Make sure the migration was successful first.')) {
    localStorage.removeItem('communities');
    localStorage.removeItem('posts');
    localStorage.removeItem('comments');
    localStorage.removeItem(`joinedCircles_${userId}`);
    console.log('localStorage data cleared successfully!');
  }
}

// Export functions for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    migrateLocalStorageToSupabase,
    clearLocalStorageData
  };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('localStorage to Supabase migration script loaded!');
  console.log('Run migrateLocalStorageToSupabase() to start migration');
  console.log('Run clearLocalStorageData(userId) to clear localStorage after migration');
}
