"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Plus, ExternalLink, Menu, Heart, Pencil, Trash2, Edit, Trash } from "lucide-react";
import { EmptyCircles, EmptyPosts } from "../components/empty-states";
import { GlassHeader } from "../components/glass-header";
import { authClient } from "@/lib/auth-client";
import { 
  communityService, 
  postService, 
  commentService, 
  userService,
  Community,
  Post,
  Comment
} from "@/lib/supabase-community";

export const CommunityView = () => {
  const queryClient = useQueryClient();
  // Get userId from session/auth
  const { data } = authClient.useSession();
  const userId = data?.user?.id || 'user1'; // fallback for local dev

  const userImage = data?.user?.image || "https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmcnx93y5khm507lnzc6pz8s6";
  const userName = data?.user?.name || "Zadulis User";
  const userHandle = data?.user?.name ? `@${data.user.name.replace(/\s+/g, '').toLowerCase()}` : "@zadulisuser";

  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('new');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  
  // Form states
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [postTags, setPostTags] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [communityInstructions, setCommunityInstructions] = useState('');
  const [communityImage, setCommunityImage] = useState('');
  const [communityUrl, setCommunityUrl] = useState('');
  const [communitySlug, setCommunitySlug] = useState('');
  const [postImage, setPostImage] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bouncingCommentHeartId, setBouncingCommentHeartId] = useState<string | null>(null);
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
  const [showUnjoinModal, setShowUnjoinModal] = useState(false);
  const [unjoinCommunityId, setUnjoinCommunityId] = useState<string | null>(null);
  const [isUnjoinDialogClosing, setIsUnjoinDialogClosing] = useState(false);
  const [isUnjoinDialogOpening, setIsUnjoinDialogOpening] = useState(false);

  // State for join modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isJoinModalClosing, setIsJoinModalClosing] = useState(false);
  const [isJoinModalOpening, setIsJoinModalOpening] = useState(false);

  // Edit/Delete states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCommunityId, setEditCommunityId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleteDialogClosing, setIsDeleteDialogClosing] = useState(false);
  const [isDeleteDialogOpening, setIsDeleteDialogOpening] = useState(false);
  const [deleteCommunityId, setDeleteCommunityId] = useState<string | null>(null);
  const [isDeleteCommunityDialogClosing, setIsDeleteCommunityDialogClosing] = useState(false);
  const [isDeleteCommunityDialogOpening, setIsDeleteCommunityDialogOpening] = useState(false);

  const [bouncingHeartId, setBouncingHeartId] = useState<string | null>(null);

  // Ensure user exists in database
  useEffect(() => {
    if (userId && data?.user) {
      userService.getOrCreate({
        id: userId,
        name: data.user.name,
        email: data.user.email,
        image: data.user.image
      }).catch(console.error);
    }
  }, [userId, data?.user]);

  // Queries
  const { data: communities, refetch: refetchCommunities, isLoading: communitiesLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: () => communityService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: joinedCircles, refetch: refetchJoinedCircles } = useQuery({
    queryKey: ['joinedCircles', userId],
    queryFn: () => communityService.getJoinedCommunities(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Derive the selected community name
  const currentCommunity = communities?.find((c: Community) => c.id === selectedCommunity);
  const currentCommunityName = selectedCommunity === 'all' ? 'All Communities' : currentCommunity?.name || '';

  // Helper: is user joined to selected circle?
  const isJoined = selectedCommunity === 'all' || (joinedCircles?.includes(selectedCommunity) ?? false);

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', selectedCommunity, sortBy],
    queryFn: () => postService.getByCommunitySorted(selectedCommunity, sortBy),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', showComments],
    queryFn: () => commentService.getByPost(showComments!),
    enabled: !!showComments,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Mutations
  const createCommunityMutation = useMutation({
    mutationFn: async (data: Omit<Community, 'id' | 'created_at' | 'updated_at'>) => {
      return communityService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setShowCreateCommunity(false);
      resetCommunityForm();
    },
    onError: (error) => {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    }
  });

  const updateCommunityMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Community> }) => {
      return communityService.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowCreateCommunity(false);
      resetCommunityForm();
    },
    onError: (error) => {
      console.error('Error updating community:', error);
      alert('Failed to update community. Please try again.');
    }
  });

  const deleteCommunityMutation = useMutation({
    mutationFn: async (id: string) => {
      return communityService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDeleteCommunityId(null);
      if (selectedCommunity === deleteCommunityId) {
        setSelectedCommunity('all');
      }
    },
    onError: (error) => {
      console.error('Error deleting community:', error);
      alert('Failed to delete community. Please try again.');
    }
  });

  const joinCommunityMutation = useMutation({
    mutationFn: async ({ userId, communityId }: { userId: string; communityId: string }) => {
      return communityService.join(userId, communityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joinedCircles', userId] });
      setShowJoinModal(false);
    },
    onError: (error) => {
      console.error('Error joining community:', error);
      alert('Failed to join community. Please try again.');
    }
  });

  const leaveCommunityMutation = useMutation({
    mutationFn: async ({ userId, communityId }: { userId: string; communityId: string }) => {
      return communityService.leave(userId, communityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joinedCircles', userId] });
      setShowUnjoinModal(false);
      setUnjoinCommunityId(null);
    },
    onError: (error) => {
      console.error('Error leaving community:', error);
      alert('Failed to leave community. Please try again.');
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => {
      return postService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowCreatePost(false);
      resetPostForm();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Post> }) => {
      return postService.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowCreatePost(false);
      resetPostForm();
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      return postService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDeletePostId(null);
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      return postService.toggleLike(postId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error liking post:', error);
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) => {
      return commentService.create(data);
    },
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setCommentContent('');
      setReplyContent('');
      setReplyingTo(null);
      setNewCommentId(newComment.id);
      setTimeout(() => {
        setNewCommentId(null);
      }, 500);
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
      alert('Failed to create comment. Please try again.');
    }
  });

  // Helper functions
  const resetCommunityForm = () => {
    setCommunityName('');
    setCommunityInstructions('');
    setCommunityImage('');
    setCommunityUrl('');
    setCommunitySlug('');
    setIsEditMode(false);
    setEditCommunityId(null);
  };

  const resetPostForm = () => {
    setPostTitle('');
    setPostContent('');
    setPostUrl('');
    setPostImage('');
    setPostTags('');
    setEditingPostId(null);
  };

  // Event handlers
  const handleCreateCommunityClick = () => {
    if (!communityName.trim() || !communityInstructions.trim()) return;
    
    const communityData = {
      name: communityName,
      slug: communitySlug,
      instructions: communityInstructions,
      image: communityImage,
      url: communityUrl,
      user_id: userId
    };

    if (isEditMode && editCommunityId) {
      updateCommunityMutation.mutate({ id: editCommunityId, updates: communityData });
    } else {
      createCommunityMutation.mutate(communityData);
    }
  };

  const handleCreatePost = () => {
    if (!postTitle.trim() || !selectedCommunity) return;
    
    const postData = {
      title: postTitle,
      content: postContent,
      url: postUrl,
      image: postImage,
      tags: postTags ? postTags.split(',').map((tag: string) => tag.trim()) : [],
      community_id: selectedCommunity,
      user_id: userId,
      author: userName,
      author_image: userImage,
      community_name: communities?.find((c: Community) => c.id === selectedCommunity)?.name || 'Unknown',
      upvotes: 0,
      downvotes: 0,
      liked_by: []
    };

    if (editingPostId) {
      updatePostMutation.mutate({ id: editingPostId, updates: postData });
    } else {
      createPostMutation.mutate(postData);
    }
  };

  const handleVote = (postId: string, type: 'up' | 'down') => {
    if (type === 'up') {
      likePostMutation.mutate({ postId, userId });
    }
    
    // Trigger bounce animation
    setBouncingHeartId(postId);
    setTimeout(() => {
      setBouncingHeartId(null);
    }, 300);
  };

  const handleCreateComment = (postId: string) => {
    if (!commentContent.trim()) return;
    
    createCommentMutation.mutate({
      content: commentContent,
      post_id: postId,
      user_id: userId,
      author: userName,
      author_image: userImage,
      upvotes: 0,
      downvotes: 0
    });
  };

  const handleReply = (postId: string, parentId: string) => {
    if (!replyContent.trim()) return;
    
    createCommentMutation.mutate({
      content: replyContent,
      post_id: postId,
      parent_id: parentId,
      user_id: userId,
      author: userName,
      author_image: userImage,
      upvotes: 0,
      downvotes: 0
    });
  };

  const handleJoinCommunity = () => {
    if (selectedCommunity && selectedCommunity !== 'all') {
      joinCommunityMutation.mutate({ userId, communityId: selectedCommunity });
    }
  };

  const handleLeaveCommunity = () => {
    if (unjoinCommunityId) {
      leaveCommunityMutation.mutate({ userId, communityId: unjoinCommunityId });
    }
  };

  if (communitiesLoading || postsLoading) {
    return <LoadingState title="Loading Communities..." />;
  }

  return (
    <div className="min-h-screen overflow-y-auto">
      <GlassHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showCreateCommunity={showCreateCommunity}
        setShowCreateCommunity={setShowCreateCommunity}
        showCreatePost={showCreatePost}
        setShowCreatePost={setShowCreatePost}
        onCreateCommunityClick={resetCommunityForm}
        onCreatePostClick={resetPostForm}
        communityDialog={
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Circle' : 'Create New Circle'}</DialogTitle>
              <DialogDescription>{isEditMode ? 'Update your circle details' : 'Create a new circle to share posts with others.'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Circle name"
                value={communityName}
                maxLength={21}
                onChange={(e) => {
                  setCommunityName(e.target.value);
                  if (!isEditMode) {
                    setCommunitySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
                  }
                }}
                className="w-full"
              />
              <Input
                placeholder="Circle slug (URL-friendly name)"
                value={communitySlug}
                maxLength={21}
                onChange={(e) => setCommunitySlug(e.target.value)}
                className="w-full"
              />
              <Textarea
                placeholder="Circle description"
                value={communityInstructions}
                maxLength={100}
                onChange={(e) => setCommunityInstructions(e.target.value)}
                className="resize-none w-full"
                rows={3}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setCommunityImage(e.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
              <Button 
                onClick={handleCreateCommunityClick} 
                disabled={!communityName.trim() || !communityInstructions.trim() || createCommunityMutation.isPending || updateCommunityMutation.isPending}
              >
                {createCommunityMutation.isPending || updateCommunityMutation.isPending ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Circle')}
              </Button>
            </div>
          </DialogContent>
        }
        postDialog={
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>{editingPostId ? 'Edit Post' : 'Create New Post'}</DialogTitle>
              <DialogDescription>{editingPostId ? 'Update your post details' : 'Share something interesting with the community.'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a community" />
                </SelectTrigger>
                <SelectContent>
                  {communities?.filter((community: Community) => 
                    (joinedCircles?.includes(community.id) ?? false) || community.user_id === userId
                  ).map((community: Community) => (
                    <SelectItem key={community.id} value={community.id}>
                      z/{community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Post title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full"
              />
              <Textarea
                placeholder="Post content (optional)"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full"
              />
              <Input
                placeholder="URL (optional)"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className="w-full"
              />
              <Input
                placeholder="Tags (comma separated, e.g. design, art, tech)"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
                className="w-full"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => setPostImage(e.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full"
              />
              <Button 
                onClick={handleCreatePost} 
                disabled={
                  !postTitle.trim() ||
                  !selectedCommunity ||
                  (!(joinedCircles?.includes(selectedCommunity) ?? false) && communities?.find((c: Community) => c.id === selectedCommunity)?.user_id !== userId) ||
                  createPostMutation.isPending ||
                  updatePostMutation.isPending
                }
                className={editingPostId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {createPostMutation.isPending || updatePostMutation.isPending ? 'Saving...' : (editingPostId ? 'Save Changes' : 'Create Post')}
              </Button>
              {selectedCommunity && !(joinedCircles?.includes(selectedCommunity) ?? false) && communities?.find((c: Community) => c.id === selectedCommunity)?.user_id !== userId && (
                <div className="text-orange-600 text-sm font-semibold mt-2">You must join this circle to post.</div>
              )}
            </div>
          </DialogContent>
        }
      />

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 py-6 md:w-full">
        {/* Instagram-style Circles Navigation */}
        <div className="mb-6 overflow-x-auto pb-3 scrollbar-hide">
          <div className="flex gap-4 min-w-max px-1 pb-1">
            {/* All Circles */}
            <div 
              className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${
                selectedCommunity === 'all' ? '' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => setSelectedCommunity('all')}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                selectedCommunity === 'all' 
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 p-[2px]' 
                  : 'border-2 border-gray-300'
              }`}>
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-xl font-bold bg-gradient-to-br from-orange-500 to-orange-600 text-transparent bg-clip-text">All</span>
                </div>
              </div>
              <span className="text-xs font-medium">All Circles</span>
            </div>
            
            {/* Community Circles */}
            {communities?.filter((community: Community) => 
              community.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((community: Community) => (
              <div 
                key={community.id}
                className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${
                  selectedCommunity === community.id ? '' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setSelectedCommunity(community.id)}
              >
                <div className={`w-16 h-16 rounded-full mb-2 ${
                  selectedCommunity === community.id 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 p-[2px]' 
                    : 'border-2 border-gray-300'
                }`}>
                  <div className="bg-white rounded-full w-full h-full overflow-hidden">
                    {community.image ? (
                      <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-xl font-bold text-gray-500">{community.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs font-medium truncate max-w-[70px] text-center">{community.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Search circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full pl-10 sm:w-auto"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <Select value={sortBy} onValueChange={(value: 'new' | 'top') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Latest</SelectItem>
              <SelectItem value="top">Most Liked</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedCommunity && (
            <span className="text-lg font-semibold text-orange-600">
              {currentCommunityName}
            </span>
          )}

          {/* Join Button */}
          {selectedCommunity !== 'all' &&
            !(joinedCircles?.includes(selectedCommunity) ?? false) &&
            (() => {
              const selected = communities?.find((c: Community) => c.id === selectedCommunity);
              if (!selected) return null;
              if (selected.user_id === userId) return null;
              return (
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all"
                  onClick={handleJoinCommunity}
                  disabled={joinCommunityMutation.isPending}
                >
                  {joinCommunityMutation.isPending ? 'Joining...' : 'Join'}
                </Button>
              );
            })()
          }
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post: Post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={post.author_image} 
                    alt={post.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">{post.author}</div>
                    <div className="text-xs text-gray-500">z/{post.community_name}</div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                
                {post.content && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.content}</p>
                )}
                
                {post.image && (
                  <div className="mb-3">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg cursor-pointer"
                      onClick={() => setShowImageModal(post.image)}
                    />
                  </div>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`flex items-center gap-1 transition-all ${
                        bouncingHeartId === post.id ? 'animate-bounce' : ''
                      }`}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          post.liked_by?.includes(userId) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`} 
                      />
                      <span className="text-sm">{post.upvotes || 0}</span>
                    </button>
                    
                    <button
                      onClick={() => setShowComments(post.id)}
                      className="flex items-center gap-1 text-gray-400 hover:text-gray-600"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Comments</span>
                    </button>
                  </div>
                  
                  {post.user_id === userId && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPostTitle(post.title);
                          setPostContent(post.content || '');
                          setPostUrl(post.url || '');
                          setPostImage(post.image || '');
                          setPostTags(post.tags?.join(', ') || '');
                          setSelectedCommunity(post.community_id);
                          setEditingPostId(post.id);
                          setShowCreatePost(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletePostId(post.id);
                          setIsDeleteDialogOpening(true);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!posts?.length && (
          <EmptyPosts onCreateClick={() => setShowCreatePost(true)} />
        )}
      </div>

      {/* Join Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Circle</DialogTitle>
            <DialogDescription>
              Join this circle to participate in discussions and create posts.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinCommunity} disabled={joinCommunityMutation.isPending}>
              {joinCommunityMutation.isPending ? 'Joining...' : 'Join Circle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unjoin Modal */}
      <Dialog open={showUnjoinModal} onOpenChange={setShowUnjoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Circle</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this circle? You'll no longer be able to post here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setShowUnjoinModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLeaveCommunity}
              disabled={leaveCommunityMutation.isPending}
            >
              {leaveCommunityMutation.isPending ? 'Leaving...' : 'Leave Circle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Post Modal */}
      <Dialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setDeletePostId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletePostId && deletePostMutation.mutate(deletePostId)}
              disabled={deletePostMutation.isPending}
            >
              {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Community Modal */}
      <Dialog open={!!deleteCommunityId} onOpenChange={() => setDeleteCommunityId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Circle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this circle? All posts in this circle will also be deleted. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setDeleteCommunityId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteCommunityId && deleteCommunityMutation.mutate(deleteCommunityId)}
              disabled={deleteCommunityMutation.isPending}
            >
              {deleteCommunityMutation.isPending ? 'Deleting...' : 'Delete Circle'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comments Modal */}
      <Dialog open={!!showComments} onOpenChange={() => setShowComments(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments?.map((comment: Comment) => (
              <div key={comment.id} className="border-b pb-3 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={comment.author_image} 
                    alt={comment.author}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => showComments && handleCreateComment(showComments)}
                disabled={!commentContent.trim() || createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={!!showImageModal} onOpenChange={() => setShowImageModal(null)}>
        <DialogContent className="max-w-4xl">
          <img 
            src={showImageModal || ''}
            alt="Full size"
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
