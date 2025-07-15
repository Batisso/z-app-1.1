"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useState, useEffect, useMemo, useCallback } from "react";
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
import { communityService, postService, commentService, userService, Post } from "@/lib/supabase-community";

export const CommunityView = () => {

    const queryClient = useQueryClient();
    // Get userId from session/auth
    const { data } = authClient.useSession();
    const userId = data?.user?.id || 'user1'; // fallback for local dev

    const userImage = data?.user?.image || "https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmcnx93y5khm507lnzc6pz8s6";
    const userName = data?.user?.name || "Zadulis User";
    const userHandle = data?.user?.name ? `@${data.user.name.replace(/\s+/g, '').toLowerCase()}` : "@zadulisuser";

    const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('new');
    const [selectedCommunity, setSelectedCommunity] = useState<string>('all'); // Changed initial state to empty string
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
    // Leave confirmation modal state
    const [leaveCommunityId, setLeaveCommunityId] = useState<string | null>(null);
    // Comments bounce animation state
    const [isCommentsBouncing, setIsCommentsBouncing] = useState(false);
    // Image upload error state
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);
    // Image cropping state
    const [showImageCropper, setShowImageCropper] = useState(false);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
    const [cropScale, setCropScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // State to track joined circles - always loaded from Supabase
    const [joinedCircles, setJoinedCircles] = useState<string[]>([]);

    // State for join modal
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [isJoinModalClosing, setIsJoinModalClosing] = useState(false);
    const [isJoinModalOpening, setIsJoinModalOpening] = useState(false);

    // Helper: is user joined to selected circle?
    const isJoined = selectedCommunity === 'all' || joinedCircles.includes(selectedCommunity);

    // Load joined circles from Supabase
    const { data: joinedCirclesData, refetch: refetchJoinedCircles } = useQuery({
        queryKey: ['community', 'joinedCircles', userId],
        queryFn: () => communityService.getJoinedCommunities(userId),
        enabled: !!userId
    });
    

    // Update joined circles when data changes
    useEffect(() => {
        if (joinedCirclesData) {
            setJoinedCircles(joinedCirclesData);
        }
    }, [joinedCirclesData]);

    // Queries
    // Queries with performance optimizations
    const { data: communities, refetch: refetchCommunities, error: communitiesError } = useQuery({
        queryKey: ['community', 'getMany'],
        queryFn: async () => {
            try {
                const result = await communityService.getAll();
                return result;
            } catch (error) {
                console.error('Error loading communities:', error);
                throw error;
            }
        },
        retry: 2, // Reduced retries for faster loading
        retryDelay: 500, // Faster retry
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches
    });

    // Memoized community calculations
    const currentCommunity = useMemo(() => 
        communities?.find((c: any) => c.id === selectedCommunity), 
        [communities, selectedCommunity]
    );
    
    const currentCommunityName = useMemo(() => 
        selectedCommunity === 'all' ? 'All Communities' : currentCommunity?.name || '', 
        [selectedCommunity, currentCommunity]
    );

    const { data: posts, isLoading, error: postsError } = useQuery({
        queryKey: ['community', 'getPosts', { communityId: selectedCommunity, sortBy }],
        queryFn: async () => {
            try {
                const result = await postService.getByCommunitySorted(selectedCommunity, sortBy);
                return result || []; // Ensure we always return an array
            } catch (error) {
                console.error('Error loading posts:', error);
                // Return empty array as fallback instead of throwing
                return [];
            }
        },
        retry: 1, // Only retry once for faster loading
        retryDelay: 300, // Faster retry delay
        staleTime: 1000 * 60 * 2, // Cache for 2 minutes
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches
    });

    const { data: comments } = useQuery({
        queryKey: ['community', 'getComments', showComments],
        queryFn: async () => {
            const result = await commentService.getByPost(showComments || '');
            return result;
        },
        enabled: !!showComments
    });

    // Comment counts for all posts - load with performance optimization
    const [loadCommentCounts, setLoadCommentCounts] = useState(false);
    
    const { data: commentCounts } = useQuery({
        queryKey: ['community', 'allCommentCounts', selectedCommunity, sortBy],
        queryFn: async () => {
            const postsToCount = posts || [];
            if (postsToCount.length === 0) return {};
            
            const counts: { [postId: string]: number } = {};
            
            try {
                // For "All Circles", limit to first 15 posts to avoid performance issues
                const postsToProcess = selectedCommunity === 'all' 
                    ? postsToCount.slice(0, 15) 
                    : postsToCount;
                
                // Get comment counts for visible posts
                await Promise.all(
                    postsToProcess.map(async (post) => {
                        try {
                            const postComments = await commentService.getByPost(post.id);
                            counts[post.id] = postComments.length;
                        } catch (error) {
                            console.error('Error loading comments for post', post.id, ':', error);
                            counts[post.id] = 0; // Fallback to 0 if error
                        }
                    })
                );
                
                // Set remaining posts to 0 if we limited them
                if (selectedCommunity === 'all' && postsToCount.length > 15) {
                    postsToCount.slice(15).forEach(post => {
                        counts[post.id] = 0;
                    });
                }
            } catch (error) {
                console.error('Error loading comment counts:', error);
                return {}; // Return empty object on error
            }
            
            return counts;
        },
        enabled: loadCommentCounts && !!posts && Array.isArray(posts) && posts.length > 0 && !isLoading,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        refetchOnWindowFocus: false, // Prevent refetch on window focus
    });

    // Load comment counts after posts are loaded - with delay for "All Circles"
    useEffect(() => {
        // Reset comment counts loading when community changes
        setLoadCommentCounts(false);
        
        if (posts && Array.isArray(posts) && posts.length > 0 && !isLoading) {
            const delay = selectedCommunity === 'all' ? 200 : 0; // Reduced delay for All Circles
            const timer = setTimeout(() => {
                setLoadCommentCounts(true);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [posts, isLoading, selectedCommunity]);

    // Mutations
    const createPostMutation = useMutation({
        mutationFn: async (data: any) => {
            const newPost = {
                title: data.title,
                content: data.content || '',
                url: data.url || '',
                image: data.image || '',
                tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
                community_id: data.communityId,
                user_id: userId,
                author: userName,
                author_image: userImage,
                community_name: communities?.find((c: any) => c.id === data.communityId)?.name || 'Unknown',
                upvotes: 0,
                downvotes: 0,
                liked_by: []
            };

            return await postService.create(newPost);
        },
        onMutate: async (variables) => {
            // Optimistic update for instant UI feedback
            const queryKey = ['community', 'getPosts', { communityId: selectedCommunity, sortBy }];
            await queryClient.cancelQueries({ queryKey });
            
            const previousPosts = queryClient.getQueryData(queryKey);
            
            // Create optimistic post
            const optimisticPost = {
                id: 'temp-' + Date.now(),
                title: variables.title,
                content: variables.content || '',
                url: variables.url || '',
                image: variables.image || '',
                tags: variables.tags ? variables.tags.split(',').map((tag: string) => tag.trim()) : [],
                community_id: variables.communityId,
                user_id: userId,
                author: userName,
                author_image: userImage,
                community_name: communities?.find((c: any) => c.id === variables.communityId)?.name || 'Unknown',
                upvotes: 0,
                downvotes: 0,
                liked_by: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Add optimistic post to the beginning of the list
            queryClient.setQueryData(queryKey, (old: any) => {
                if (!old) return [optimisticPost];
                return [optimisticPost, ...old];
            });

            // Close dialog immediately for better UX
            setShowCreatePost(false);
            setPostTitle('');
            setPostContent('');
            setPostUrl('');
            setPostImage('');
            setPostTags('');
            
            return { previousPosts };
        },
        onError: (err, variables, context) => {
            console.error('Post creation error:', err);
            // Rollback optimistic update on error
            const queryKey = ['community', 'getPosts', { communityId: selectedCommunity, sortBy }];
            if (context?.previousPosts) {
                queryClient.setQueryData(queryKey, context.previousPosts);
            }
            // Reopen dialog on error
            setShowCreatePost(true);
            setPostTitle(variables.title);
            setPostContent(variables.content || '');
            setPostUrl(variables.url || '');
            setPostImage(variables.image || '');
            setPostTags(variables.tags || '');
        },
        onSettled: () => {
            // Refetch to get the real data and remove optimistic post - only current community
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'getPosts', { communityId: selectedCommunity, sortBy }],
                exact: true
            });
            
            // Only invalidate comment counts for the specific community
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'allCommentCounts', selectedCommunity],
                exact: true
            });
        }
    });

    const updatePostMutation = useMutation({
        mutationFn: async (data: any) => {
            return await postService.update(data.postId, {
                title: data.title,
                content: data.content,
                url: data.url,
                image: data.image,
                tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
                community_id: data.communityId,
                community_name: communities?.find((c: any) => c.id === data.communityId)?.name || 'Unknown'
            });
        },
        onSuccess: () => {
            // Only invalidate the specific community's posts
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'getPosts', { communityId: selectedCommunity, sortBy }],
                exact: true
            });
            
            setShowCreatePost(false);
            setPostTitle('');
            setPostContent('');
            setPostUrl('');
            setPostImage('');
            setPostTags('');
            setEditingPostId(null);
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            return await postService.delete(postId);
        },
        onSuccess: () => {
            // Only invalidate the current community's posts
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'getPosts', { communityId: selectedCommunity, sortBy }],
                exact: true
            });
            
            // Update comment counts only for current community
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'allCommentCounts', selectedCommunity],
                exact: true
            });
            
            setDeletePostId(null);
            setIsDeleteDialogClosing(false);
        }
    });

    const updateCommunityMutation = useMutation({
        mutationFn: async (data: any) => {
            if (data.isEditMode && data.editCommunityId) {
                return await communityService.update(data.editCommunityId, {
                    name: data.name,
                    slug: data.slug,
                    instructions: data.instructions,
                    image: data.image,
                    url: data.url
                });
            } else {
                return await communityService.create({
                    name: data.name,
                    slug: data.slug,
                    instructions: data.instructions,
                    image: data.image,
                    url: data.url,
                    user_id: data.userId
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community', 'getMany'] });
            queryClient.invalidateQueries({ queryKey: ['community', 'getPosts'] });
            setShowCreateCommunity(false);
            setCommunityName('');
            setCommunityInstructions('');
            setCommunityImage('');
            setCommunityUrl('');
            setCommunitySlug('');
            setIsEditMode(false);
            setEditCommunityId(null);
        }
    });

    const voteMutation = useMutation({
        mutationFn: async (data: any) => {
            if (data.type === 'up') {
                await postService.toggleLike(data.postId, userId);
            } else {
                await postService.vote(data.postId, userId, data.type);
            }
            return { success: true };
        },
        onMutate: async (variables) => {
            // Optimistic update for instant UI feedback
            const queryKey = ['community', 'getPosts', { communityId: selectedCommunity, sortBy }];
            await queryClient.cancelQueries({ queryKey });
            
            const previousPosts = queryClient.getQueryData(queryKey);
            
            if (previousPosts && variables.type === 'up') {
                queryClient.setQueryData(queryKey, (old: any) => {
                    return old?.map((post: any) => {
                        if (post.id === variables.postId) {
                            const isLiked = post.liked_by?.includes(userId); // Use userId from component scope
                            const newLikedBy = isLiked 
                                ? post.liked_by.filter((id: string) => id !== userId)
                                : [...(post.liked_by || []), userId];
                            const newUpvotes = isLiked 
                                ? Math.max(0, (post.upvotes || 0) - 1)
                                : (post.upvotes || 0) + 1;
                            

                            
                            return {
                                ...post,
                                liked_by: newLikedBy,
                                upvotes: newUpvotes
                            };
                        }
                        return post;
                    });
                });
            }
            
            return { previousPosts };
        },
        onError: (err, variables, context) => {
            console.error('Vote mutation error:', err);
            // Rollback optimistic update on error
            const queryKey = ['community', 'getPosts', { communityId: selectedCommunity, sortBy }];
            if (context?.previousPosts) {
                queryClient.setQueryData(queryKey, context.previousPosts);
            }
        },
        onSettled: () => {
            // Refetch to ensure data consistency - only for current community
            const queryKey = ['community', 'getPosts', { communityId: selectedCommunity, sortBy }];
            queryClient.invalidateQueries({ queryKey, exact: true });
        }
    });

    const createCommentMutation = useMutation({
        mutationFn: async (data: any) => {
            const newComment = {
                content: data.content,
                post_id: data.postId,
                parent_id: typeof data.parent_id !== 'undefined' ? data.parent_id : null, // Always use parent_id, fallback to null
                user_id: data.userId,
                author: userName,
                author_image: userImage,
                upvotes: 0,
                downvotes: 0,
                liked_by: []
            };

            return await commentService.create(newComment);
        },
        onMutate: async (variables) => {
            // Optimistic update for comments
            const queryKey = ['community', 'getComments', showComments];
            await queryClient.cancelQueries({ queryKey });
            
            const previousComments = queryClient.getQueryData(queryKey);
            
            // Create optimistic comment
            const optimisticComment = {
                id: 'temp-' + Date.now(),
                content: variables.content,
                post_id: variables.postId,
                parent_id: typeof variables.parent_id !== 'undefined' ? variables.parent_id : null, // Always use parent_id, fallback to null
                user_id: variables.userId,
                author: userName,
                author_image: userImage,
                upvotes: 0,
                downvotes: 0,
                liked_by: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Add optimistic comment
            queryClient.setQueryData(queryKey, (old: any) => {
                if (!old) return [optimisticComment];
                return [...old, optimisticComment];
            });

            // Clear input immediately
            setCommentContent('');
            setNewCommentId(optimisticComment.id);
            setTimeout(() => {
                setNewCommentId(null);
            }, 500);
            
            return { previousComments };
        },
        onError: (err, variables, context) => {
            console.error('Comment creation error:', err);
            // Rollback optimistic update on error
            const queryKey = ['community', 'getComments', showComments];
            if (context?.previousComments) {
                queryClient.setQueryData(queryKey, context.previousComments);
            }
            // Restore comment content on error
            setCommentContent(variables.content);
        },
        onSettled: () => {
            // Refetch to get the real data
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'getComments', showComments],
                exact: true
            });
            
            // Update comment counts more efficiently
            queryClient.invalidateQueries({ 
                queryKey: ['community', 'allCommentCounts', selectedCommunity],
                exact: true
            });
        }
    });

    // Join/Leave community mutations
    const joinCommunityMutation = useMutation({
        mutationFn: async (communityId: string) => {
            await communityService.join(userId, communityId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community', 'joinedCircles', userId] });
            refetchJoinedCircles();
        }
    });

    const leaveCommunityMutation = useMutation({
        mutationFn: async (communityId: string) => {
            await communityService.leave(userId, communityId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community', 'joinedCircles', userId] });
            refetchJoinedCircles();
        }
    });

    // Add state for edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [editCommunityId, setEditCommunityId] = useState<string | null>(null);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [isDeleteDialogClosing, setIsDeleteDialogClosing] = useState(false);
    const [isDeleteDialogOpening, setIsDeleteDialogOpening] = useState(false);


    const handleCreateCommunityClick = () => {
        if (!communityName.trim() || !communityInstructions.trim()) return;

        updateCommunityMutation.mutate({
            isEditMode,
            editCommunityId,
            name: communityName,
            slug: communitySlug,
            instructions: communityInstructions,
            image: communityImage,
            url: communityUrl,
            userId
        });
    };

    const handleCreatePost = async () => {
        if (!postTitle.trim() || !selectedCommunity) return;

        if (editingPostId) {
            // Update existing post
            updatePostMutation.mutate({
                postId: editingPostId,
                title: postTitle,
                content: postContent,
                url: postUrl,
                image: postImage,
                tags: postTags,
                communityId: selectedCommunity
            });
        } else {
            // Create new post
            createPostMutation.mutate({
                title: postTitle,
                content: postContent,
                url: postUrl,
                image: postImage,
                tags: postTags,
                communityId: selectedCommunity,
                userId: userId
            });
        }
    };

    const [bouncingHeartId, setBouncingHeartId] = useState<string | null>(null);

    const handleVote = (postId: string, type: 'up' | 'down') => {
        // Use Supabase for all voting
        voteMutation.mutate({
            postId,
            type,
            userId
        });

        // Trigger bounce animation
        setBouncingHeartId(postId);
        setTimeout(() => {
            setBouncingHeartId(null);
        }, 300); // Duration of the animation
    };

    const handleCreateComment = (postId: string) => {
        if (!commentContent.trim()) return;

        createCommentMutation.mutate({
            content: commentContent,
            postId,
            parent_id: null, // Explicitly set parent_id to null for top-level comments
            userId: userId
        });
    };

    const handleReply = (postId: string, parentId: string) => {
        if (!replyContent.trim()) return;

        createCommentMutation.mutate({
            content: replyContent,
            postId,
            parent_id: parentId || null, // Always use parent_id, fallback to null
            userId: userId
        });

        setReplyingTo(null);
        setReplyContent('');
    };



    const handleDeletePost = (postId: string) => {
        deletePostMutation.mutate(postId);
    };

    const handleCommentVote = async (commentId: string) => {
        try {
            const currentComment = comments?.find(c => c.id === commentId);
            if (!currentComment) return;

            const isLiked = currentComment.liked_by?.includes(userId);
            
            let newLikedBy: string[];
            let newUpvotes: number;
            
            if (isLiked) {
                // Unlike
                newLikedBy = (currentComment.liked_by || []).filter(id => id !== userId);
                newUpvotes = Math.max(0, (currentComment.upvotes || 0) - 1);
            } else {
                // Like
                newLikedBy = [...(currentComment.liked_by || []), userId];
                newUpvotes = (currentComment.upvotes || 0) + 1;
            }

            // Update comment in Supabase
            await commentService.update(commentId, {
                upvotes: newUpvotes,
                liked_by: newLikedBy
            });

            // Refresh only the specific post's comments
            queryClient.invalidateQueries({ queryKey: ['community', 'getComments', showComments] });

            // Trigger bounce animation
            setBouncingCommentHeartId(commentId);
            setTimeout(() => {
                setBouncingCommentHeartId(null);
            }, 300);

        } catch (error) {
            console.error('Error voting on comment:', error);
        }
    };

    // Helper function to format relative time
    const formatRelativeTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            
            if (diffInSeconds < 60) return 'just now';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
            
            return date.toLocaleDateString();
        } catch (error) {
            return 'unknown';
        }
    };

    // State to track which comment replies are open
    const [openReplies, setOpenReplies] = useState<{ [key: string]: boolean }>({});

    const toggleReplies = (commentId: string) => {
        setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    // Image cropping functions
    const handleCropMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - cropPosition.x,
            y: e.clientY - cropPosition.y
        });
    };

    const handleCropMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Constrain movement within bounds
        const maxX = 100;
        const maxY = 100;
        const minX = -100;
        const minY = -100;
        
        setCropPosition({
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY))
        });
    };

    const handleCropMouseUp = () => {
        setIsDragging(false);
    };

    const handleCropImage = async () => {
        if (!originalImage || isProcessing) return;
        
        setIsProcessing(true);
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = () => {
                    const size = 300; // Output size
                    canvas.width = size;
                    canvas.height = size;
                    
                    if (ctx) {
                        // Calculate crop area
                        const scale = Math.max(img.width, img.height) / 300;
                        const scaledWidth = img.width / scale * cropScale;
                        const scaledHeight = img.height / scale * cropScale;
                        
                        const sourceX = Math.max(0, (img.width - scaledWidth) / 2 - cropPosition.x * scale);
                        const sourceY = Math.max(0, (img.height - scaledHeight) / 2 - cropPosition.y * scale);
                        const sourceWidth = Math.min(scaledWidth, img.width - sourceX);
                        const sourceHeight = Math.min(scaledHeight, img.height - sourceY);
                        
                        // Draw cropped image
                        ctx.drawImage(
                            img,
                            sourceX, sourceY, sourceWidth, sourceHeight,
                            0, 0, size, size
                        );
                        
                        resolve(true);
                    } else {
                        reject(new Error('Canvas context not available'));
                    }
                };
                img.onerror = reject;
                img.src = originalImage;
            });
            
            // Convert to base64
            const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
            setCommunityImage(croppedImage);
            setShowImageCropper(false);
            setOriginalImage(null);
            setImageLoaded(false);
        } catch (error) {
            console.error('Error cropping image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Reset image loaded state when cropper opens
    useEffect(() => {
        if (showImageCropper && originalImage) {
            setImageLoaded(false);
        }
    }, [showImageCropper, originalImage]);

    // Removed the old handleCreateCommunity function as it's replaced by handleCreateCommunityClick

    // Memoized calculations for better performance
    const safePosts = useMemo(() => Array.isArray(posts) ? posts : [], [posts]);
    
    // Memoized filtered communities for search
    const filteredCommunities = useMemo(() => 
        communities?.filter((community: any) =>
            community.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [], 
        [communities, searchQuery]
    );

    // Memoized community likes calculation
    const communityLikes = useMemo(() => {
        const likes: Record<string, number> = {};
        if (communities && safePosts) {
            safePosts.forEach((post: any) => {
                if (post.community_id) {
                    likes[post.community_id] = (likes[post.community_id] || 0) + (post.upvotes || 0);
                }
            });
        }
        return likes;
    }, [communities, safePosts]);

    // Memoized sorted communities for sidebar
    const sortedCommunities = useMemo(() => 
        (communities || [])
            .map((community: any) => ({
                ...community,
                totalLikes: communityLikes[community.id] || 0
            }))
            .sort((a: any, b: any) => b.totalLikes - a.totalLikes)
            .slice(0, 5),
        [communities, communityLikes]
    );

    // Memoized user posts for sidebar
    const userPosts = useMemo(() => 
        safePosts.filter((post: any) => post.author === userName).slice(0, 3),
        [safePosts, userName]
    );

    // Memoized total user likes
    const totalUserLikes = useMemo(() => 
        safePosts.filter((post: any) => post.author === userName)
            .reduce((total: number, post: any) => total + (post.upvotes || 0), 0),
        [safePosts, userName]
    );

    // Optimized callbacks
    const handleCommunitySelect = useCallback((communityId: string) => {
        setSelectedCommunity(communityId);
    }, []);

    const handlePrefetchCommunity = useCallback((communityId: string) => {
        queryClient.prefetchQuery({
            queryKey: ['community', 'getPosts', { communityId, sortBy }],
            queryFn: () => postService.getByCommunitySorted(communityId, sortBy),
            staleTime: 1000 * 60 * 1, // Cache for 1 minute
        });
    }, [queryClient, sortBy]);

    // Handle loading state - no error state since we fallback to empty array
    if (isLoading && safePosts.length === 0) {
        return <LoadingState title="Loading..." />;
    }

    return (
        <div className="min-h-screen">
            <GlassHeader
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                showCreateCommunity={showCreateCommunity}
                setShowCreateCommunity={setShowCreateCommunity}
                showCreatePost={showCreatePost}
                setShowCreatePost={setShowCreatePost}
                onCreateCommunityClick={() => {
                    setIsEditMode(false);
                    setEditCommunityId(null);
                    setCommunityName('');
                    setCommunityInstructions('');
                    setCommunityImage('');
                    setCommunityUrl('');
                    setCommunitySlug('');
                    setImageUploadError(null);
                }}
                onCreatePostClick={() => {
                    setPostTitle('');
                    setPostContent('');
                    setPostUrl('');
                    setPostImage('');
                    setPostTags('');
                    setEditingPostId(null);
                }}
                communityDialog={
                    <DialogContent 
                        className="max-w-lg w-full"
                        onPointerDownOutside={(e) => {
                            // Prevent dialog from closing when image cropper is open
                            if (showImageCropper) {
                                e.preventDefault();
                            }
                        }}
                        onEscapeKeyDown={(e) => {
                            // Prevent dialog from closing with Escape when image cropper is open
                            if (showImageCropper) {
                                e.preventDefault();
                            }
                        }}
                    >
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

                            {/* Image Upload Section */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Circle Image</label>
                                <div className="flex items-center gap-4">
                                    {/* Image Preview */}
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                                        {communityImage ? (
                                            <img 
                                                src={communityImage} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-gray-400 text-xs text-center">
                                                <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <label className="cursor-pointer">
                                            <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
                                                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm font-medium text-orange-600">
                                                    {communityImage ? 'Change Image' : 'Upload Image'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        // Check file size (5MB = 5 * 1024 * 1024 bytes)
                                                        const maxSize = 5 * 1024 * 1024;
                                                        if (file.size > maxSize) {
                                                            setImageUploadError('File size must be less than 5MB. Please choose a smaller image.');
                                                            // Clear the file input
                                                            e.target.value = '';
                                                            return;
                                                        }
                                                        
                                                        // Clear any previous error
                                                        setImageUploadError(null);
                                                        
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            const imageData = e.target?.result as string;
                                                            setOriginalImage(imageData);
                                                            setCropPosition({ x: 0, y: 0 });
                                                            setCropScale(1);
                                                            setShowImageCropper(true);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        
                                        {/* Remove Image Button */}
                                        {communityImage && (
                                            <button
                                                type="button"
                                                onClick={() => setCommunityImage('')}
                                                className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Remove Image
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* Error Message */}
                                {imageUploadError && (
                                    <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {imageUploadError}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500">
                                    Upload a square image for best results. Max file size: 5MB
                                </p>
                            </div>
                            <Button 
                                onClick={handleCreateCommunityClick} 
                                disabled={!communityName.trim() || !communityInstructions.trim() || updateCommunityMutation.isPending}
                            >
                                {updateCommunityMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {isEditMode ? 'Saving...' : 'Creating...'}
                                    </div>
                                ) : (
                                    isEditMode ? 'Save Changes' : 'Create Circle'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                }
                postDialog={
                    <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-3">
                            <DialogTitle className="text-lg">{editingPostId ? 'Edit Post' : 'Create Post'}</DialogTitle>
                            <DialogDescription className="text-sm">{editingPostId ? 'Update your post' : 'Share with the community'}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {/* Compact Community Selection */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700">Circle</label>
                                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                                    <SelectTrigger className="h-10 border border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors">
                                        <SelectValue placeholder="Select circle">
                                            {selectedCommunity && (() => {
                                                const community = communities?.find((c: any) => c.id === selectedCommunity);
                                                return community ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-orange-200">
                                                            {community.image ? (
                                                                <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                                                    <span className="text-xs font-bold text-orange-600">{community.name.charAt(0)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{community.name}</span>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-48">
                                        {communities?.filter((community: any) => joinedCircles.includes(community.id) || community.user_id === userId).map((community: any) => (
                                            <SelectItem key={community.id} value={community.id} className="p-2 cursor-pointer hover:bg-orange-50">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-200 flex-shrink-0">
                                                        {community.image ? (
                                                            <img src={community.image} alt={community.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                                                <span className="text-xs font-bold text-orange-600">{community.name.charAt(0)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-medium text-gray-900">{community.name}</span>
                                                            {community.user_id === userId && (
                                                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5">Owner</Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-500 truncate">{community.instructions}</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedCommunity && !joinedCircles.includes(selectedCommunity) && communities?.find((c: any) => c.id === selectedCommunity)?.user_id !== userId && (
                                    <div className="flex items-center gap-2 text-orange-600 text-xs font-medium bg-orange-50 border border-orange-200 rounded-md p-2">
                                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        You must join this circle to post here.
                                    </div>
                                )}
                            </div>

                            <Input
                                placeholder="Post title"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                className="w-full h-10 border border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors"
                            />
                            <Textarea
                                placeholder="Post content (optional)"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="w-full min-h-[80px] border border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors resize-none"
                                rows={3}
                            />
                            
                            {/* Compact Two-Column Layout for URL and Tags */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    placeholder="URL (optional)"
                                    value={postUrl}
                                    onChange={(e) => setPostUrl(e.target.value)}
                                    className="w-full h-10 border border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors"
                                />
                                <Input
                                    placeholder="Tags (e.g. design, art)"
                                    value={postTags}
                                    onChange={(e) => setPostTags(e.target.value)}
                                    className="w-full h-10 border border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors"
                                />
                            </div>
                            
                            {/* Enhanced Image Upload Section */}
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Add Image
                                </label>
                                
                                {postImage ? (
                                    /* Image Preview with Controls */
                                    <div className="space-y-3">
                                        <div className="w-full h-32 rounded-lg border-2 border-orange-200 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm relative">
                                            <img 
                                                src={postImage} 
                                                alt="Post preview" 
                                                className="w-full h-full object-cover"
                                            />
                                            {/* File Size Info */}
                                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                                Max 8MB
                                            </div>
                                        </div>
                                        
                                        {/* Always Visible Controls */}
                                        <div className="flex items-center justify-center gap-3">
                                            <label className="cursor-pointer">
                                                <div className="bg-orange-100 hover:bg-orange-200 text-orange-700 hover:text-orange-800 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md border border-orange-200">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Replace Image
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            // Check file size (8MB limit)
                                                            const maxSize = 8 * 1024 * 1024;
                                                            if (file.size > maxSize) {
                                                                alert('File size must be less than 8MB. Please choose a smaller image.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            
                                                            const reader = new FileReader();
                                                            reader.onload = (e) => setPostImage(e.target?.result as string);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                            
                                            <button
                                                type="button"
                                                onClick={() => setPostImage('')}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md border border-red-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove Image
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Upload Area */
                                    <label className="cursor-pointer block">
                                        <div className="w-full h-32 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 group bg-gradient-to-br from-orange-25 to-orange-50">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors">
                                                    Click to upload image
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    JPG, PNG, GIF up to 8MB
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // Check file size (8MB limit)
                                                    const maxSize = 8 * 1024 * 1024;
                                                    if (file.size > maxSize) {
                                                        alert('File size must be less than 8MB. Please choose a smaller image.');
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => setPostImage(e.target?.result as string);
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            <Button
                                onClick={handleCreatePost}
                                disabled={
                                    !postTitle.trim() ||
                                    !selectedCommunity || // Ensure a community is selected
                                    (!joinedCircles.includes(selectedCommunity) && communities?.find((c: any) => c.id === selectedCommunity)?.user_id !== userId) ||
                                    createPostMutation.isPending ||
                                    updatePostMutation.isPending
                                }
                                className={`w-full h-10 font-semibold text-white transition-all duration-200 ${
                                    editingPostId 
                                        ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' 
                                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-md hover:scale-[1.01]'
                                }`}
                            >
                                {(createPostMutation.isPending || updatePostMutation.isPending) ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {editingPostId ? 'Saving...' : 'Posting...'}
                                    </div>
                                ) : (
                                    <>
                                        {editingPostId ? (
                                            <>
                                                <Edit className="w-4 h-4 mr-1.5" />
                                                Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-1.5" />
                                                Create Post
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                }
            />

            {/* Full Screen Loading Overlay for Post Operations - Only show for delete and update */}
            {(updatePostMutation.isPending || deletePostMutation.isPending) && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" style={{ overflow: 'hidden' }}>
                    <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-base font-semibold text-gray-900">
                            {deletePostMutation.isPending ? 'Deleting Post...' : 'Saving Changes...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Full Screen Loading Overlay for Community Operations */}
            {updateCommunityMutation.isPending && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ overflow: 'hidden' }}>
                    <div className="bg-white rounded-xl p-8 shadow-xl flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-lg font-semibold text-gray-900">
                            {isEditMode ? 'Saving Circle...' : 'Creating Circle...'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {isEditMode ? 'Please wait while we update your circle' : 'Please wait while we create your circle'}
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="w-full mx-auto px-4 sm:px-6 py-6 md:w-full">
                {/* Instagram-style Circles Navigation */}
                <div className="mb-6 overflow-x-auto pb-3 scrollbar-hide">
                    <div className="flex gap-4 min-w-max px-1 pb-1">
                        {/* All Circles */}
                        <div
                            className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${selectedCommunity === 'all' ? '' : 'opacity-70 hover:opacity-100'
                                }`}
                            onClick={() => setSelectedCommunity('all')}
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${selectedCommunity === 'all'
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
                        {filteredCommunities.map((community: any) => (
                            <div
                                key={community.id}
                                className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${selectedCommunity === community.id ? '' : 'opacity-70 hover:opacity-100'
                                    }`}
                                onClick={() => handleCommunitySelect(community.id)}
                                onMouseEnter={() => handlePrefetchCommunity(community.id)}
                            >
                                <div className={`w-16 h-16 rounded-full mb-2 ${selectedCommunity === community.id
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

                    {/* User's Circles Edit/Delete Controls */}

                    {/* Orange Join Button or Leave Button */}
                    {selectedCommunity !== 'all' && (() => {
                        const selected = communities?.find((c: any) => c.id === selectedCommunity);
                        if (!selected) return null;
                        if (selected.user_id === userId) return null; // Don't show for creator
                        if (!joinedCircles.includes(selectedCommunity)) {
                            return (
                                <Button
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all"
                                    onClick={() => {
                                        setShowJoinModal(true);
                                        setIsJoinModalOpening(true);
                                        setTimeout(() => setIsJoinModalOpening(false), 50);
                                    }}
                                >
                                    Join
                                </Button>
                            );
                        } else {
                            return (
                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all"
                                    onClick={() => {
                                        setLeaveCommunityId(selectedCommunity);
                                    }}
                                >
                                    Leave
                                </Button>
                            );
                        }
                    })()}

                    <div className="flex-grow"></div>
                </div>

                {/* Sidebar and Posts Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden 2xl:block 2xl:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* User Profile */}
                            <div className="rounded-xl p-6 shadow-sm border bg-gradient-to-br from-slate-300/50 to-gray-50/50 backdrop-blur-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                                        <img
                                            src={userImage}
                                            alt={userName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg">{userName}</h3>
                                    <p className="text-sm opacity-70 mb-3">{userHandle}</p>

                                    {/* Total Likes */}
                                    <p className="text-sm font-medium text-orange-500 dark:text-orange-100 glow-text">
                                        {posts?.filter((post: any) => post.author === userName).reduce((total: number, post: any) => total + (post.upvotes || 0), 0)} Total Likes
                                    </p>
                                </div>
                            </div>

                            {/* Your Circles */}
                            <div className="rounded-xl p-6 shadow-sm border bg-gradient-to-br from-slate-300/50 to-gray-50/50 ">
                                <h3 className="font-semibold mb-4">
                                    Popular Circles
                                </h3>
                                <div className="space-y-2">
                                    {(() => {
                                        // Calculate total likes for each community
                                        const communityLikes: Record<string, number> = {};
                                        if (communities && posts) {
                                            posts.forEach((post: any) => {
                                                if (post.community_id) {
                                                    communityLikes[post.community_id] = (communityLikes[post.community_id] || 0) + (post.upvotes || 0);
                                                }
                                            });
                                        }
                                        // Sort communities by total likes (descending)
                                        const sortedCommunities = (communities || [])
                                            .map((community: any) => ({
                                                ...community,
                                                totalLikes: communityLikes[community.id] || 0
                                            }))
                                            .sort((a: any, b: any) => b.totalLikes - a.totalLikes)
                                            .slice(0, 5);
                                        if (sortedCommunities.length > 0) {
                                            return sortedCommunities.map((community: any) => (
                                                <div
                                                    key={community.id}
                                                    className="flex items-center justify-between p-2 hover:bg-orange-500 rounded-lg transition-colors group"
                                                >
                                                    <div
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => setSelectedCommunity(community.id)}
                                                    >
                                                        {community.image && (
                                                            <img src={community.image} alt={community.name} className="w-8 h-8 rounded-full object-cover" />
                                                        )}
                                                        <span className="text-sm font-medium">{community.name}</span>
                                                        <span className="ml-2 text-xs text-orange-600 font-bold">{communityLikes[community.id] || 0} likes</span>
                                                    </div>
                                                    {/* Only show edit/delete if current user is the creator (author) of the circle */}
                                                    {community.user_id === userId && (
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                                                onClick={(e: React.MouseEvent) => {
                                                                    e.stopPropagation();
                                                                    setCommunityName(community.name);
                                                                    setCommunityInstructions(community.instructions);
                                                                    setCommunityImage(community.image || '');
                                                                    setCommunityUrl(community.url || '');
                                                                    setCommunitySlug(community.slug || '');
                                                                    setIsEditMode(true);
                                                                    setEditCommunityId(community.id);
                                                                    setShowCreateCommunity(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ));
                                        } else {
                                            return (
                                                <EmptyCircles
                                                    onCreateClick={() => {
                                                        setIsEditMode(false);
                                                        setEditCommunityId(null);
                                                        setCommunityName('');
                                                        setCommunityInstructions('');
                                                        setCommunityImage('');
                                                        setShowCreateCommunity(true);
                                                    }}
                                                />
                                            );
                                        }
                                    })()}
                                </div>
                            </div>

                            {/* Your Created Circles */}
                            <div className="rounded-xl p-6 shadow-sm border bg-gradient-to-br from-slate-300/50 to-gray-50/50 ">
                                <h3 className="font-semibold mb-4">
                                    <span>Your Created Circles</span>
                                </h3>
                                <div className="space-y-2">
                                    {(communities?.filter((community: any) => community.user_id === userId)?.length || 0) > 0 ? (
                                        communities?.filter((community: any) => community.user_id === userId)?.map((community: any) => (
                                            <div
                                                key={community.id}
                                                className="flex items-center justify-between p-2 hover:bg-orange-500 rounded-lg transition-colors group"
                                            >
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer"
                                                    onClick={() => setSelectedCommunity(community.id)}
                                                >
                                                    {community.image && (
                                                        <img src={community.image} alt={community.name} className="w-8 h-8 rounded-full object-cover" />
                                                    )}
                                                    <span className="text-sm font-medium">{community.name}</span>
                                                </div>
                                                {community.user_id === userId && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.stopPropagation();
                                                                setCommunityName(community.name);
                                                                setCommunityInstructions(community.instructions);
                                                                setCommunityImage(community.image || '');
                                                                setCommunityUrl(community.url || '');
                                                                setCommunitySlug(community.slug || '');
                                                                setIsEditMode(true);
                                                                setEditCommunityId(community.id);
                                                                setShowCreateCommunity(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyCircles
                                            onCreateClick={() => {
                                                setIsEditMode(false);
                                                setEditCommunityId(null);
                                                setCommunityName('');
                                                setCommunityInstructions('');
                                                setCommunityImage('');
                                                setShowCreateCommunity(true);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Joined Circles */}
                            <div className="rounded-xl p-6 shadow-sm border bg-gradient-to-br from-slate-300/50 to-gray-50/50 ">
                                <h3 className="font-semibold mb-4">
                                    <span>Joined Circles</span>
                                </h3>
                                <div className="space-y-2">
                                    {(communities?.filter((community: any) => joinedCircles.includes(community.id) && community.user_id !== userId)?.length || 0) > 0 ? (
                                        communities?.filter((community: any) => joinedCircles.includes(community.id) && community.user_id !== userId)?.map((community: any) => (
                                            <div
                                                key={community.id}
                                                className="flex items-center justify-between p-2 hover:bg-orange-500 rounded-lg transition-colors group"
                                            >
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer"
                                                    onClick={() => setSelectedCommunity(community.id)}
                                                >
                                                    {community.image && (
                                                        <img src={community.image} alt={community.name} className="w-8 h-8 rounded-full object-cover" />
                                                    )}
                                                    <span className="text-sm font-medium">{community.name}</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 rounded-full hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();
                                                        setLeaveCommunityId(community.id);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            You haven't joined any circles yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Unjoin Confirmation Dialog */}
                            {unjoinCommunityId && (
                                <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isUnjoinDialogClosing ? 'opacity-0' : isUnjoinDialogOpening ? 'opacity-0' : 'opacity-100'
                                    }`}>
                                    <div className={`bg-black rounded-xl p-6 max-w-sm w-full shadow-xl transition-all duration-300 ${isUnjoinDialogClosing ? 'scale-95 opacity-0' : isUnjoinDialogOpening ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                                        }`}>
                                        <h3 className="text-lg font-semibold mb-2 text-white">Leave Circle</h3>
                                        <p className="text-white mb-6">Are you sure you want to leave this circle? You can rejoin anytime.</p>
                                        <div className="flex gap-3 justify-end">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsUnjoinDialogClosing(true);
                                                    setTimeout(() => {
                                                        setUnjoinCommunityId(null);
                                                        setIsUnjoinDialogClosing(false);
                                                    }, 300);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => {
                                                    setIsUnjoinDialogClosing(true);
                                                    setTimeout(() => {
                                                        // Use mutation to leave and refetch from backend
                                                        if (unjoinCommunityId) {
                                                            leaveCommunityMutation.mutate(unjoinCommunityId);
                                                        }
                                                        setUnjoinCommunityId(null);
                                                        setIsUnjoinDialogClosing(false);
                                                    }, 300);
                                                }}
                                            >
                                                Leave
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* Your Posts */}
                            <div className="rounded-xl p-6 shadow-sm border bg-gradient-to-br from-slate-300/50 to-gray-50/50">
                                <h3 className="font-semibold mb-4">
                                    Your Posts
                                </h3>
                                <div className="space-y-3">
                                    {posts && posts.filter((post: Post) => post.author === userName).length > 0 ? (
                                        posts.filter((post: Post) => post.author === userName).slice(0, 3).map((post: Post) => (
                                            <div
                                                key={post.id}
                                                className="p-2 hover:bg-orange-500 rounded-lg transition-colors group"
                                            >
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        const postElement = document.getElementById(`post-${post.id}`);
                                                        if (postElement) {
                                                            postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                            postElement.classList.add('ring-2', 'ring-orange-500');
                                                            setTimeout(() => {
                                                                postElement.classList.remove('ring-2', 'ring-indigo-500');
                                                            }, 2000);
                                                        }
                                                        setShowComments(post.id);
                                                    }}
                                                >
                                                    <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-xs">{post.community_name}</p>
                                                        <p className="text-xs">{post.upvotes || 0} likes</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600"
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
                                                        <Pencil className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
                                                        onClick={() => {
                                                            setDeletePostId(post.id);
                                                            setIsDeleteDialogOpening(true);
                                                            setTimeout(() => setIsDeleteDialogOpening(false), 50);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyPosts onCreateClick={() => setShowCreatePost(true)} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar - Mobile Overlay */}
                    {sidebarOpen && (
                        <>
                            <div
                                className={`fixed inset-0 bg-black/50 z-40 2xl:hidden transition-opacity duration-450 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                                onClick={() => setSidebarOpen(false)}
                            />
                            <div className={`fixed left-0 top-0 h-full w-64 sm:w-80 z-50 2xl:hidden transform transition-transform duration-450 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                                <div className="h-full overflow-y-auto bg-white/20 lg:bg-transparent p-6 lg:p-0 space-y-6">
                                    {/* User Profile */}
                                    <div className="rounded-xl p-6 shadow-sm border-2 border-amber-50bg-gradient-to-br from-slate-50/10 to-purple-50/50 backdrop-blur-sm">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md mb-3">
                                                <img
                                                    src={userImage}
                                                    alt={userName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg">{userName}</h3>
                                            <p className="text-sm opacity-70 mb-3">{userHandle}</p>
                                            {/* Total Likes */}
                                            <p className="text-sm font-medium text-pink-500 dark:text-orange-100 glow-text">
                                                {posts?.filter((post: any) => post.author === userName).reduce((total: number, post: any) => total + (post.upvotes || 0), 0)} Total Likes
                                            </p>
                                        </div>
                                    </div>
                                    {/* Quick Circle Navigation */}
                                    <div className="rounded-xl p-6 shadow-sm border  bg-gradient-to-br from-white/70 to-purple-50/70">
                                        <h3 className="font-semibold mb-4 dark:text-slate-900">
                                            Popular Circles
                                        </h3>
                                        <div className="space-y-2">
                                            {(() => {
                                                // Calculate total likes for each community
                                                const communityLikes: Record<string, number> = {};
                                                if (communities && posts) {
                                                posts.forEach((post: any) => {
                                                if (post.community_id) {
                                                communityLikes[post.community_id] = (communityLikes[post.community_id] || 0) + (post.upvotes || 0);
                                                }
                                                });
                                                }
                                                // Sort communities by total likes (descending)
                                                const sortedCommunities = (communities || [])
                                                    .map((community: any) => ({
                                                        ...community,
                                                        totalLikes: communityLikes[community.id] || 0
                                                    }))
                                                    .sort((a: any, b: any) => b.totalLikes - a.totalLikes)
                                                    .slice(0, 5);
                                                if (sortedCommunities.length > 0) {
                                                    return sortedCommunities.map((community: any) => (
                                                        <div
                                                            key={community.id}
                                                            className="flex items-center justify-between p-2 hover:bg-indigo-50 rounded-lg transition-colors group dark:text-slate-900"
                                                        >
                                                            <div
                                                                className="flex items-center gap-3 cursor-pointer"
                                                                onClick={() => {
                                                                    setSelectedCommunity(community.id);
                                                                    setSidebarOpen(false);
                                                                }}
                                                            >
                                                                {community.image && (
                                                                    <img src={community.image} alt={community.name} className="w-8 h-8 rounded-full object-cover" />
                                                                )}
                                                                <span className="text-sm font-medium">{community.name}</span>
                                                                <span className="ml-2 text-xs text-orange-600 font-bold">{communityLikes[community.id] || 0} likes</span>
                                                            </div>
                                                            {/* Only show edit/delete if current user is the creator */}
                                                            {community.userId === userId && (
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                                                        onClick={(e: React.MouseEvent) => {
                                                                            e.stopPropagation();
                                                                            setCommunityName(community.name);
                                                                            setCommunityInstructions(community.instructions);
                                                                            setCommunityImage(community.image || '');
                                                                            setCommunityUrl(community.url || '');
                                                                            setCommunitySlug(community.slug || '');
                                                                            setIsEditMode(true);
                                                                            setEditCommunityId(community.id);
                                                                            setShowCreateCommunity(true);
                                                                        }}
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Button>

                                                                </div>
                                                            )}
                                                        </div>
                                                    ));
                                                } else {
                                                    return (
                                                        <EmptyCircles
                                                            onCreateClick={() => {
                                                                setIsEditMode(false);
                                                                setEditCommunityId(null);
                                                                setCommunityName('');
                                                                setCommunityInstructions('');
                                                                setCommunityImage('');
                                                                setShowCreateCommunity(true);
                                                                setSidebarOpen(false);
                                                            }}
                                                            isMobile={true}
                                                        />
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    {/* Your Created Circles - Mobile */}
                                    <div className="rounded-xl p-6 shadow-sm border  bg-gradient-to-br from-white/70 to-purple-50/70">
                                        <h3 className="font-semibold mb-4 dark:text-slate-900">
                                            Your Created Circles
                                        </h3>
                                        <div className="space-y-2">
                                            {(communities?.length || 0) > 0 ? (
                                                communities?.map((community: any) => (
                                                    <div
                                                        key={community.id}
                                                        className="flex items-center justify-between p-2 hover:bg-indigo-50 rounded-lg transition-colors group dark:text-slate-900"
                                                    >
                                                        <div
                                                            className="flex items-center gap-3 cursor-pointer"
                                                            onClick={() => {
                                                                setSelectedCommunity(community.id);
                                                                setSidebarOpen(false);
                                                            }}
                                                        >
                                                            {community.image && (
                                                                <img src={community.image} alt={community.name} className="w-8 h-8 rounded-full object-cover" />
                                                            )}
                                                            <span className="text-sm font-medium">{community.name}</span>
                                                        </div>
                                                        {community.userId === userId && (
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                                                    onClick={(e: React.MouseEvent) => {
                                                                        e.stopPropagation();
                                                                        setCommunityName(community.name);
                                                                        setCommunityInstructions(community.instructions);
                                                                        setCommunityImage(community.image || '');
                                                                        setCommunityUrl(community.url || '');
                                                                        setCommunitySlug(community.slug || '');
                                                                        setIsEditMode(true);
                                                                        setEditCommunityId(community.id);
                                                                        setShowCreateCommunity(true);
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </Button>

                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <EmptyCircles
                                                    onCreateClick={() => {
                                                        setIsEditMode(false);
                                                        setEditCommunityId(null);
                                                        setCommunityName('');
                                                        setCommunityInstructions('');
                                                        setCommunityImage('');
                                                        setShowCreateCommunity(true);
                                                        setSidebarOpen(false);
                                                    }}
                                                    isMobile={true}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Your Posts */}
                                    <div className="rounded-xl p-6 shadow-sm border bg-gradient-to-br from-white/70 to-purple-50/70">
                                        <h3 className="font-semibold mb-4 dark:text-slate-900">
                                            Your Posts
                                        </h3>
                                        <div className="space-y-3">
                                            {posts && posts.filter((post: Post) => post.author === userName).length > 0 ? (
                                                posts.filter((post: Post) => post.author === userName).slice(0, 3).map((post: Post) => (
                                                    <div
                                                        key={post.id}
                                                        className="p-2 hover:bg-indigo-50 rounded-4xl transition-colors group border-1 border-slate-400 bg-white/50"
                                                    >
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                // Find the post in the feed
                                                                const postElement = document.getElementById(`post-${post.id}`);
                                                                if (postElement) {
                                                                    // Scroll to the post
                                                                    postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                    // Highlight the post briefly
                                                                    postElement.classList.add('ring-2', 'ring-indigo-500');
                                                                    setTimeout(() => {
                                                                        postElement.classList.remove('ring-2', 'ring-indigo-500');
                                                                    }, 2000);
                                                                }
                                                                // Open comments
                                                                setShowComments(post.id);
                                                                // Close sidebar
                                                                setSidebarOpen(false);
                                                            }}
                                                        >
                                                            <p className="text-sm font-medium line-clamp-2 dark:text-slate-900">{post.title}</p>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <p className="text-xs text-purple-400 font-bold">{post.community_name}</p>
                                                                <p className="text-xs text-pink-600">{post.upvotes || 0} likes</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2 bg-amber-200">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 rounded-full bg-blue-800 text-blue-600"
                                                                onClick={() => {
                                                                    setPostTitle(post.title);
                                                                    setPostContent(post.content || '');
                                                                    setPostUrl(post.url || '');
                                                                    setPostImage(post.image || '');
                                                                    setPostTags(post.tags?.join(', ') || '');
                                                                    setSelectedCommunity(post.community_id);
                                                                    setEditingPostId(post.id);
                                                                    setShowCreatePost(true);
                                                                    setSidebarOpen(false);
                                                                }}
                                                            >
                                                                <Pencil className="w-3 h-3 bg-blue-800 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
                                                                onClick={() => {
                                                                    setDeletePostId(post.id);
                                                                    setIsDeleteDialogOpening(true);
                                                                    setTimeout(() => setIsDeleteDialogOpening(false), 50);
                                                                }}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <EmptyPosts
                                                    onCreateClick={() => {
                                                        setShowCreatePost(true);
                                                        setSidebarOpen(false);
                                                    }}
                                                    isMobile={true}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Posts Feed */}
                    <div className="md:col-span-3 lg:col-span-4 space-y-7">
                        {safePosts && safePosts.length > 0 ? (
                            safePosts.map((post: any) => (
                                <Card
                                    key={post.id}
                                    id={`post-${post.id}`}
                                    className="border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden bg-slate-200/50 backdrop-blur-sm group"
                                    style={{ 
                                        pointerEvents: 'auto',
                                        position: 'relative',
                                        zIndex: 'auto',
                                        willChange: 'auto'
                                    }}
                                >
                                    <CardContent className="p-0">
                                        <div className="flex flex-col">
                                            {/* Post image preview */}
                                            {post.image && (
                                                <div className="w-full h-64 overflow-hidden cursor-pointer relative bg-gray-100" onClick={() => {
                                                    setShowImageModal(post.image);
                                                    setIsOpeningModal(true);
                                                    setTimeout(() => setIsOpeningModal(false), 50);
                                                }}>
                                                    <img 
                                                        src={post.image} 
                                                        alt={post.title} 
                                                        className="w-full h-full object-cover transition-opacity duration-300 max-w-full" 
                                                        style={{
                                                            minHeight: '256px',
                                                            maxHeight: '256px',
                                                            width: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                        loading="lazy"
                                                        onLoad={(e) => {
                                                            (e.target as HTMLImageElement).style.opacity = '1';
                                                        }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full font-medium shadow-lg">
                                                            Click To View
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Post content */}
                                            <div className="flex-1 p-5 space-y-4">
                                                {/* Creator info */}
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 rounded-2xl bg-black/10">
                                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border-3 border-white shadow-sm">
                                                                <img
                                                                    src={post.authorImage || `https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmcnx93y5khm507lnzc6pz8s6?u=${post.author}`}
                                                                    alt={post.author}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{post.author}</div>
                                                                <div className="text-xs opacity-70 flex items-center gap-1 ">
                                                                    <span>{formatRelativeTime(post.created_at)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {post.author === userName && (
                                                            <div className="flex gap-1 ml-auto mr-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600"
                                                                    onClick={(e: React.MouseEvent) => {
                                                                        e.stopPropagation();
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
                                                                    <Pencil className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
                                                                    onClick={(e: React.MouseEvent) => {
                                                                        e.stopPropagation();
                                                                        setDeletePostId(post.id);
                                                                        setIsDeleteDialogOpening(true);
                                                                        setTimeout(() => setIsDeleteDialogOpening(false), 50);
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Badge className="bg-indigo-100 text-orange-800 border-0 flex items-center gap-1">
                                                    {(() => {
                                                    const community = communities?.find((c: any) => c.id === post.community_id);
                                                    return community?.image ? (
                                                    <img src={community.image} alt={post.community_name} className="w-4 h-4 rounded-full object-cover" />
                                                    ) : null;
                                                    })()}
                                                    {post.community_name}
                                                    </Badge>
                                                </div>

                                                <h3 className="text-xl font-semibold hover:text-orange-500 transition-colors cursor-pointer">
                                                    {post.title}
                                                </h3>

                                                {/* Tags */}
                                                {post.tags && post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {post.tags.map((tag: string, index: number) => (
                                                            <Badge
                                                                key={index}
                                                                className="bg-orange-300 text-slate-800 hover:bg-orange-200 transition-colors cursor-pointer rounded-full px-3"
                                                            >
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                                {post.content && (
                                                    <div className="rounded-lg p-2 bg text-lg">
                                                        <p className="leading-relaxed">{post.content}</p>
                                                    </div>
                                                )}

                                                {post.url && (
                                                    <a
                                                        href={post.url.startsWith('http://') || post.url.startsWith('https://') ? post.url : `https://${post.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-orange-600 transition-all text-sm font-medium"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Visit Link
                                                    </a>
                                                )}

                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    {/* Like button */}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleVote(post.id, 'up')}
                                                            className={`p-2 h-9 w-9 rounded-full transition-colors ${post.liked_by?.includes(userId) ? 'hover:bg-red-100 bg-red-50' : 'hover:bg-gray-200'}`}
                                                        >
                                                            <Heart className={`w-4 h-4 transition-transform duration-300 ease-out ${bouncingHeartId === post.id ? 'scale-125' : 'scale-100'} ${post.liked_by?.includes(userId) ? 'text-red-500' : 'text-gray-400'}`}
                                                                fill={post.liked_by?.includes(userId) ? "currentColor" : "none"} />
                                                        </Button>
                                                        <span className="text-sm font-semibold">
                                                            {post.upvotes || 0} likes
                                                        </span>
                                                    </div>

                                                    {/* Comments button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                                                        className="flex items-center gap-2 hover:bg-indigo-500 hover:text-orange-300 rounded-full px-4 py-2"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        {(() => {
                                                            // Get comment count from query
                                                            const commentCount = commentCounts?.[post.id] ?? 0;
                                                            return commentCount === 0 ? 'Comments' : `${commentCount} Comment${commentCount === 1 ? '' : 's'}`;
                                                        })()}
                                                    </Button>
                                                </div>

                                                {/* Comments section */}
                                                {showComments === post.id && (
                                                    <div className="mt-6 space-y-4 bg-slate-50 rounded-xl p-6">
                                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                                            <MessageCircle className="w-4 h-4" /> Comments ({comments?.length || 0})
                                                        </h4>
                                                        <div className="flex gap-3">
                                                            <Textarea
                                                                placeholder="What are your thoughts? 💭"
                                                                value={commentContent}
                                                                onChange={(e) => setCommentContent(e.target.value)}
                                                                className="flex-1 bg-white border-orange-200 focus:border-orange-400 rounded-lg text-slate-800"
                                                            />
                                                            <Button
                                                                onClick={() => handleCreateComment(post.id)}
                                                                disabled={!commentContent.trim()}
                                                                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 px-6"
                                                            >
                                                                <MessageCircle className="w-3 h-3 mr-1" /> Reply
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {(() => {
                                                                // Normalize all comments to use parent_id
                                                                const normalizedComments = Array.isArray(comments) ? comments.map((c: any) => ({
                                                                    ...c,
                                                                    parent_id: c.parent_id ?? c.parentId ?? null
                                                                })) : [];
                                                                // Build a map of id -> comment
                                                                const commentMap: Record<string, any> = {};
                                                                normalizedComments.forEach((c: any) => {
                                                                    commentMap[c.id] = { ...c, replies: [] };
                                                                });
                                                                // Build the tree
                                                                const roots: any[] = [];
                                                                normalizedComments.forEach((c: any) => {
                                                                    if (c.parent_id && commentMap[c.parent_id]) {
                                                                        commentMap[c.parent_id].replies.push(commentMap[c.id]);
                                                                    } else if (!c.parent_id) {
                                                                        roots.push(commentMap[c.id]);
                                                                    }
                                                                });
                                                                // Recursive render
                                                                const renderTree = (nodes: any[], level = 0) => nodes.map((comment: any) => (
                                                                    <div key={comment.id} className={level === 0 ? 'mb-4' : 'ml-8 mt-2 relative'}>
                                                                        {/* Instagram-style connecting line for replies */}
                                                                        {level > 0 && (
                                                                            <div className="absolute -left-4 top-0 w-6 h-6 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"></div>
                                                                        )}
                                                                        <div
                                                                            className={`${level > 0 ? 'bg-gray-50/50 p-2 rounded-lg border-l-2 border-gray-200' : 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm'} ${level > 0 ? 'text-sm' : ''} ${newCommentId === comment.id ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 ease-out transform origin-top`}
                                                                        >
                                                                            <div className="flex items-center gap-3 text-sm mb-3">
                                                                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-400 flex items-center justify-center">
                                                                                    <img
                                                                                        src={comment.authorImage || (comment.author === userName ? userImage : `https://us-west-2.graphassets.com/cmbfqm0kn1bab07n13z3ygjxo/output=format:jpg/resize=width:830/cmcnx93y5khm507lnzc6pz8s6?u=${comment.author}`)}
                                                                                        alt={comment.author}
                                                                                        className="w-full h-full object-cover"
                                                                                    />
                                                                                </div>
                                                                                <span className="font-medium text-gray-800">{comment.author}</span>
                                                                                <span className="text-gray-400">•</span>
                                                                                <span className="text-gray-500">{formatRelativeTime(comment.created_at)}</span>
                                                                            </div>
                                                                            <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className={`p-2 h-8 w-8 rounded-full transition-colors ${comment.liked_by?.includes(userId) ? 'hover:bg-red-100 bg-red-50' : 'hover:bg-gray-200'}`}
                                                                                        onClick={() => handleCommentVote(comment.id)}
                                                                                    >
                                                                                        <Heart className={`w-4 h-4 transition-transform duration-300 ease-out ${bouncingCommentHeartId === comment.id ? 'scale-125' : 'scale-100'} ${comment.liked_by?.includes(userId) ? 'text-red-500' : 'text-gray-400'}`} 
                                                                                            fill={comment.liked_by?.includes(userId) ? "currentColor" : "none"} />
                                                                                    </Button>
                                                                                    <span className="text-sm font-medium text-gray-600">
                                                                                        {comment.upvotes || 0}
                                                                                    </span>
                                                                                </div>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-gray-500 hover:text-gray-700 text-xs"
                                                                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                                                >
                                                                                    <MessageCircle className="w-3 h-3 mr-1" /> Reply
                                                                                </Button>
                                                                            </div>

                                                                            {replyingTo === comment.id && (
                                                                                <div className="mt-4 flex gap-2">
                                                                                    <Textarea
                                                                                        placeholder="Write a reply..."
                                                                                        value={replyContent}
                                                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                                                        className="flex-1 bg-gray-50 border-gray-300"
                                                                                    />
                                                                                    <Button
                                                                                        onClick={() => handleReply(post.id, comment.id)}
                                                                                        disabled={!replyContent.trim()}
                                                                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                                                                    >
                                                                                        Reply
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {/* Nested replies */}
                                                                        {comment.replies && comment.replies.length > 0 && (
                                                                            <div>
                                                                                {!openReplies[comment.id] ? (
                                                                                    <Button size="sm" variant="ghost" className="text-xs text-orange-600 px-2 py-1 border-2 m-2" onClick={() => toggleReplies(comment.id)}>
                                                                                        View Replies ({comment.replies.length})
                                                                                    </Button>
                                                                                ) : (
                                                                                    <>
                                                                                        <Button size="sm" variant="ghost" className="text-xs text-orange-600 px-2 py-1" onClick={() => toggleReplies(comment.id)}>
                                                                                            Hide Replies
                                                                                        </Button>
                                                                                        {renderTree(comment.replies, level + 1)}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ));
                                                                if (roots.length === 0) {
                                                                    return (
                                                                        <div className="text-center py-8">
                                                                            <div className="text-4xl mb-2">🤔</div>
                                                                            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                                                                        </div>
                                                                    );
                                                                }
                                                                return renderTree(roots, 0);
                                                            })()}
                                                        </div>

                                                        {comments?.length === 0 && (
                                                            <div className="text-center py-8">
                                                                <div className="text-4xl mb-2">🤔</div>
                                                                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-indigo-100">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
                                    <span className="text-6xl">✨</span>
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-3 text-center">No posts yet!</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto text-center">
                                    {selectedCommunity === 'all'
                                        ? "It looks like there aren't any posts yet. Be the first to share something amazing!"
                                        : "This circle doesn't have any posts yet. Why not start the conversation?"}
                                </p>
                                <div className="flex justify-center">
                                    <Button
                                        onClick={() => setShowCreatePost(true)}
                                        className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-yellow-600 hover:to-green-700 text-white border-0 px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                        Create First Post
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Create Post Button */}
            <div className="fixed bottom-6 right-6 z-30">
                <Button
                    onClick={() => setShowCreatePost(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    disabled={selectedCommunity !== 'all' && !joinedCircles.includes(selectedCommunity)}
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </div>



            {/* Delete Post Confirmation Dialog */}
            {deletePostId && (
                <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isDeleteDialogClosing ? 'opacity-0' : isDeleteDialogOpening ? 'opacity-0' : 'opacity-100'
                    }`}>
                    <div className={`bg-black rounded-xl p-6 max-w-sm w-full shadow-xl transition-all duration-300 ${isDeleteDialogClosing ? 'scale-95 opacity-0' : isDeleteDialogOpening ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                        }`}>
                        <h3 className="text-lg font-semibold mb-2 text-white">Delete Post</h3>
                        <p className="text-white mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <Button

                                variant="outline"
                                onClick={() => {
                                    setIsDeleteDialogClosing(true);
                                    setTimeout(() => {
                                        setDeletePostId(null);
                                        setIsDeleteDialogClosing(false);
                                    }, 300);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deletePostMutation.isPending}
                                onClick={() => {
                                if (deletePostId) {
                                    handleDeletePost(deletePostId);
                                }
                                }}
                            >
                                {deletePostMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Confirmation Dialog (for both header and sidebar) */}
            {Boolean(leaveCommunityId) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl transition-all duration-300">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">Leave Circle</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to leave this circle? You can rejoin anytime.</p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setLeaveCommunityId(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => {
                                    if (leaveCommunityId) {
                                        leaveCommunityMutation.mutate(leaveCommunityId);
                                    }
                                    setLeaveCommunityId(null);
                                }}
                            >
                                Leave
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div
                    className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-all duration-300 ${isClosingModal ? 'opacity-0' : isOpeningModal ? 'opacity-0' : 'opacity-100'
                        }`}
                    onClick={() => {
                        setIsClosingModal(true);
                        setTimeout(() => {
                            setShowImageModal(null);
                            setIsClosingModal(false);
                        }, 300);
                    }}
                >
                    <div className={`relative max-w-4xl max-h-full transition-all duration-300 ${isClosingModal ? 'scale-95 opacity-0' : isOpeningModal ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                        }`}>
                        <img
                            src={showImageModal}
                            alt="Full size"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => {
                                setIsClosingModal(true);
                                setTimeout(() => {
                                    setShowImageModal(null);
                                    setIsClosingModal(false);
                                }, 300);
                            }}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Join Modal */}
            {showJoinModal && (() => {
                const selected = communities?.find((c: any) => c.id === selectedCommunity);
                if (!selected) return null;
                return (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${isJoinModalClosing ? 'opacity-0' : isJoinModalOpening ? 'opacity-0' : 'opacity-100'
                        }`}>
                        <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative transition-all duration-300 ${isJoinModalClosing ? 'scale-95 opacity-0' : isJoinModalOpening ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                            }`}>
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                                onClick={() => {
                                    setIsJoinModalClosing(true);
                                    setTimeout(() => {
                                        setShowJoinModal(false);
                                        setIsJoinModalClosing(false);
                                    }, 300);
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <img src={selected.image} alt={selected.name} className="w-16 h-16 rounded-full object-cover mb-4" />
                            <h2 className="text-xl font-bold mb-2">Join {selected.name}?</h2>
                            <p className="text-gray-600 mb-6 text-center">{selected.instructions || 'Are you sure you want to join this circle?'}</p>
                            <Button
                                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-2 shadow-md transition-all mb-2 w-full"
                                onClick={() => {
                                    setIsJoinModalClosing(true);
                                    setTimeout(() => {
                                        // Add to joinedCircles and localStorage
                                        const updated = [...joinedCircles, selected.id];
                                        setJoinedCircles(updated);
                                        if (typeof window !== 'undefined') {
                                            localStorage.setItem(`joinedCircles_${userId}`, JSON.stringify(updated));
                                        }
                                        // Use mutation to join and refetch from backend
                                        joinCommunityMutation.mutate(selected.id);
                                        setShowJoinModal(false);
                                        setIsJoinModalClosing(false);
                                    }, 300);
                                }}
                            >
                                Confirm Join
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setIsJoinModalClosing(true);
                                    setTimeout(() => {
                                        setShowJoinModal(false);
                                        setIsJoinModalClosing(false);
                                    }, 300);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                );
            })()}

            {/* Instagram-style Image Cropper Modal */}
            {showImageCropper && originalImage && (
                <div 
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999] p-4"
                    style={{ pointerEvents: 'auto' }}
                    onClick={(e) => {
                        // Only close if clicking the backdrop, not the modal content
                        if (e.target === e.currentTarget) {
                            setShowImageCropper(false);
                            setOriginalImage(null);
                            setImageLoaded(false);
                        }
                    }}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        style={{ pointerEvents: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowImageCropper(false);
                                    setOriginalImage(null);
                                    setImageLoaded(false);
                                }}
                                className="text-gray-600 hover:text-gray-800 font-medium transition-colors cursor-pointer"
                                disabled={isProcessing}
                                style={{ pointerEvents: 'auto' }}
                            >
                                Cancel
                            </button>
                            <h3 className="font-semibold text-lg">Edit Photo</h3>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCropImage();
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                disabled={!imageLoaded || isProcessing}
                                style={{ pointerEvents: 'auto' }}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Done'
                                )}
                            </button>
                        </div>

                        {/* Crop Area */}
                        <div className="relative bg-black" style={{ pointerEvents: 'auto' }}>
                            <div className="w-full h-80 relative overflow-hidden">
                                {/* Loading State */}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-white text-sm">Loading image...</p>
                                        </div>
                                    </div>
                                )}

                                {/* Image */}
                                <div
                                    className={`absolute inset-0 cursor-move transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    style={{
                                        transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropScale})`,
                                        transformOrigin: 'center',
                                        pointerEvents: imageLoaded ? 'auto' : 'none'
                                    }}
                                    onMouseDown={(e) => {
                                        if (imageLoaded && !isProcessing) {
                                            e.preventDefault();
                                            handleCropMouseDown(e);
                                        }
                                    }}
                                    onMouseMove={(e) => {
                                        if (imageLoaded && !isProcessing) {
                                            handleCropMouseMove(e);
                                        }
                                    }}
                                    onMouseUp={(e) => {
                                        if (imageLoaded && !isProcessing) {
                                            handleCropMouseUp();
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (imageLoaded && !isProcessing) {
                                            handleCropMouseUp();
                                        }
                                    }}
                                >
                                    <img
                                        src={originalImage}
                                        alt="Crop preview"
                                        className="w-full h-full object-contain pointer-events-none select-none"
                                        draggable={false}
                                        onLoad={() => {
                                            console.log('Image loaded successfully');
                                            setImageLoaded(true);
                                        }}
                                        onError={() => {
                                            console.error('Failed to load image for cropping');
                                            setImageLoaded(false);
                                        }}
                                    />
                                </div>

                                {/* Circular Crop Overlay */}
                                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                                    {/* Dark overlay with circular cutout */}
                                    <div 
                                        className="absolute inset-0"
                                        style={{
                                            background: `radial-gradient(circle at center, transparent 120px, rgba(0,0,0,0.7) 120px)`
                                        }}
                                    />
                                    
                                    {/* Circle border */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border-2 border-white rounded-full pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-4 space-y-4" style={{ pointerEvents: 'auto' }}>
                            {/* Zoom Slider */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Zoom</label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="3"
                                    step="0.1"
                                    value={cropScale}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCropScale(parseFloat(e.target.value));
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-opacity"
                                    disabled={!imageLoaded || isProcessing}
                                    style={{
                                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${((cropScale - 0.5) / 2.5) * 100}%, #e5e7eb ${((cropScale - 0.5) / 2.5) * 100}%, #e5e7eb 100%)`,
                                        opacity: imageLoaded && !isProcessing ? 1 : 0.5,
                                        pointerEvents: imageLoaded && !isProcessing ? 'auto' : 'none'
                                    }}
                                />
                            </div>

                            {/* Instructions */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    {!imageLoaded ? 'Loading image...' : 
                                     isProcessing ? 'Processing image...' : 
                                     'Drag to reposition • Use slider to zoom'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CommunityViewLoading = () => {
    return (
        <LoadingState
            title="LOADING COMMUNITY"
        />
    );
};

export const CommunityViewError = () => {
    return (
        <ErrorState
            title=":( Error Loading"
            description="Try Refreshing The Page"
        />
    );
};
