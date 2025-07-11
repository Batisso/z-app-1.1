import { supabase } from './supabase';

export interface Community {
  id: string;
  name: string;
  slug: string;
  instructions: string;
  image?: string;
  url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  url?: string;
  image?: string;
  tags?: string[];
  community_id: string;
  user_id: string;
  author: string;
  author_image: string;
  community_name: string;
  upvotes: number;
  downvotes: number;
  liked_by: string[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  parent_id?: string;
  user_id: string;
  author: string;
  author_image: string;
  upvotes: number;
  downvotes: number;
  liked_by: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  user_id: string;
  community_id: string;
  joined_at: string;
}

// Community operations
export const communityService = {
  // Get all communities
  async getAll(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('community')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create a new community
  async create(community: Omit<Community, 'id' | 'created_at' | 'updated_at'>): Promise<Community> {
    const id = Math.random().toString(36).substring(2, 15);
    const { data, error } = await supabase
      .from('community')
      .insert([{ ...community, id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a community
  async update(id: string, updates: Partial<Community>): Promise<Community> {
    const { data, error } = await supabase
      .from('community')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a community
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('community')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Join a community
  async join(userId: string, communityId: string): Promise<CommunityMember> {
    const id = Math.random().toString(36).substring(2, 15);
    const { data, error } = await supabase
      .from('community_members')
      .insert([{ id, user_id: userId, community_id: communityId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Leave a community
  async leave(userId: string, communityId: string): Promise<void> {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('user_id', userId)
      .eq('community_id', communityId);
    
    if (error) throw error;
  },

  // Get user's joined communities
  async getJoinedCommunities(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data?.map(item => item.community_id) || [];
  }
};

// Post operations
export const postService = {
  // Get posts by community or all posts
  async getByCommunitySorted(communityId?: string, sortBy: 'hot' | 'new' | 'top' = 'new'): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select('*');
    
    if (communityId && communityId !== 'all') {
      query = query.eq('community_id', communityId);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'new':
        query = query.order('created_at', { ascending: false });
        break;
      case 'top':
        query = query.order('upvotes', { ascending: false });
        break;
      case 'hot':
        // For now, use creation date. You can implement a more complex hot algorithm later
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  // Create a new post
  async create(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const id = Math.random().toString(36).substring(2, 15);
    const { data, error } = await supabase
      .from('posts')
      .insert([{ ...post, id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a post
  async update(id: string, updates: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a post
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Vote on a post
  async vote(postId: string, userId: string, type: 'up' | 'down'): Promise<void> {
    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    if (existingVote) {
      // Update existing vote
      await supabase
        .from('votes')
        .update({ type })
        .eq('post_id', postId)
        .eq('user_id', userId);
    } else {
      // Create new vote
      const voteId = Math.random().toString(36).substring(2, 15);
      await supabase
        .from('votes')
        .insert([{ id: voteId, post_id: postId, user_id: userId, type }]);
    }
    
    // Update post vote counts
    const { data: votes } = await supabase
      .from('votes')
      .select('type')
      .eq('post_id', postId);
    
    const upvotes = votes?.filter(v => v.type === 'up').length || 0;
    const downvotes = votes?.filter(v => v.type === 'down').length || 0;
    
    await supabase
      .from('posts')
      .update({ upvotes, downvotes })
      .eq('id', postId);
  },

  // Toggle like on a post (simplified version)
  async toggleLike(postId: string, userId: string): Promise<void> {
    console.log('toggleLike called:', { postId, userId });
    
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('liked_by, upvotes')
      .eq('id', postId)
      .single();
    
    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
    
    if (!post) {
      console.log('Post not found');
      return;
    }
    
    console.log('Current post data:', post);
    
    const likedBy = post.liked_by || [];
    const isLiked = likedBy.includes(userId);
    
    console.log('Like status:', { isLiked, likedBy, userId });
    
    let newLikedBy: string[];
    let newUpvotes: number;
    
    if (isLiked) {
      // Unlike
      newLikedBy = likedBy.filter(id => id !== userId);
      newUpvotes = Math.max(0, (post.upvotes || 0) - 1);
      console.log('Unliking post');
    } else {
      // Like
      newLikedBy = [...likedBy, userId];
      newUpvotes = (post.upvotes || 0) + 1;
      console.log('Liking post');
    }
    
    console.log('New values:', { newLikedBy, newUpvotes });
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ liked_by: newLikedBy, upvotes: newUpvotes })
      .eq('id', postId);
    
    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }
    
    console.log('Post updated successfully');
  }
};

// Comment operations
export const commentService = {
  // Get comments for a post
  async getByPost(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create a new comment
  async create(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment> {
    const id = Math.random().toString(36).substring(2, 15);
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...comment, id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a comment
  async update(id: string, updates: Partial<Comment>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a comment
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// User operations
export const userService = {
  // Get or create user
  async getOrCreate(userData: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    // First try to get existing user
    const { data: existingUser } = await supabase
      .from('user')
      .select('*')
      .eq('id', userData.id)
      .single();
    
    if (existingUser) {
      return existingUser;
    }
    
    // Create new user if doesn't exist
    const { data, error } = await supabase
      .from('user')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user
  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('user')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
