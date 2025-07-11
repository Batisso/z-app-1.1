import { db } from "@/db";
import { community, posts, comments, votes, user } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { z } from "zod";
import { eq, desc, sql, and } from "drizzle-orm";

export const communityRouter = createTRPCRouter({
    getMany: baseProcedure.query(async () => {
        if (!db) {
            throw new Error("Database connection is not available.");
        }
        const data = await db
        .select()
        .from(community);
        
        return data;
    }),

    getPosts: baseProcedure
        .input(z.object({
            communityId: z.string().optional(),
            sortBy: z.enum(['hot', 'new', 'top']).default('hot')
        }))
        .query(async ({ input }) => {
            if (!db) {
                throw new Error("Database connection is not available.");
            }
            
            let query = db
                .select({
                    id: posts.id,
                    title: posts.title,
                    content: posts.content,
                    url: posts.url,
                    upvotes: posts.upvotes,
                    downvotes: posts.downvotes,
                    createdAt: posts.createdAt,
                    author: user.name,
                    communityName: community.name,
                    score: sql<number>`${posts.upvotes} - ${posts.downvotes}`.as('score')
                })
                .from(posts)
                .leftJoin(user, eq(posts.userId, user.id))
                .leftJoin(community, eq(posts.communityId, community.id));

            if (input.communityId) {
                query = query.where(eq(posts.communityId, input.communityId));
            }

            switch (input.sortBy) {
                case 'new':
                    query = query.orderBy(desc(posts.createdAt));
                    break;
                case 'top':
                    query = query.orderBy(desc(sql`${posts.upvotes} - ${posts.downvotes}`));
                    break;
                default:
                    query = query.orderBy(desc(sql`${posts.upvotes} - ${posts.downvotes}`));
            }

            return await query;
        }),

    createPost: baseProcedure
        .input(z.object({
            title: z.string().min(1),
            content: z.string().optional(),
            url: z.string().optional(),
            communityId: z.string(),
            userId: z.string()
        }))
        .mutation(async ({ input }) => {
            if (!db) {
                throw new Error("Database connection is not available.");
            }
            
            const [newPost] = await db
                .insert(posts)
                .values(input)
                .returning();
            
            return newPost;
        }),

    vote: baseProcedure
        .input(z.object({
            postId: z.string().optional(),
            commentId: z.string().optional(),
            type: z.enum(['up', 'down']),
            userId: z.string()
        }))
        .mutation(async ({ input }) => {
            if (!db) {
                throw new Error("Database connection is not available.");
            }

            // Check if user already voted
            const existingVote = await db
                .select()
                .from(votes)
                .where(
                    and(
                        eq(votes.userId, input.userId),
                        input.postId ? eq(votes.postId, input.postId) : eq(votes.commentId, input.commentId!)
                    )
                );

            if (existingVote.length > 0) {
                // Update existing vote
                await db
                    .update(votes)
                    .set({ type: input.type })
                    .where(eq(votes.id, existingVote[0].id));
            } else {
                // Create new vote
                await db
                    .insert(votes)
                    .values(input);
            }

            // Update post/comment vote counts
            if (input.postId) {
                const upvoteCount = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(votes)
                    .where(and(eq(votes.postId, input.postId), eq(votes.type, 'up')));
                
                const downvoteCount = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(votes)
                    .where(and(eq(votes.postId, input.postId), eq(votes.type, 'down')));

                await db
                    .update(posts)
                    .set({
                        upvotes: upvoteCount[0].count,
                        downvotes: downvoteCount[0].count
                    })
                    .where(eq(posts.id, input.postId));
            }

            return { success: true };
        }),

    getComments: baseProcedure
        .input(z.object({ postId: z.string() }))
        .query(async ({ input }) => {
            if (!db) {
                throw new Error("Database connection is not available.");
            }
            
            const data = await db
                .select({
                    id: comments.id,
                    content: comments.content,
                    upvotes: comments.upvotes,
                    downvotes: comments.downvotes,
                    createdAt: comments.createdAt,
                    parentId: comments.parentId,
                    author: user.name
                })
                .from(comments)
                .leftJoin(user, eq(comments.userId, user.id))
                .where(eq(comments.postId, input.postId))
                .orderBy(desc(comments.createdAt));
            
            return data;
        }),

    createComment: baseProcedure
        .input(z.object({
            content: z.string().min(1),
            postId: z.string(),
            parentId: z.string().optional(),
            userId: z.string()
        }))
        .mutation(async ({ input }) => {
            if (!db) {
                throw new Error("Database connection is not available.");
            }
            
            const [newComment] = await db
                .insert(comments)
                .values(input)
                .returning();
            
            return newComment;
        }),

    createCommunity: baseProcedure
        .input(z.object({
            name: z.string().min(1),
            instructions: z.string().min(1),
            userId: z.string()
        }))
        .mutation(async ({ input }) => {
            if (!db) {
                throw new Error("Database connection is not available.");
            }
            
            const [newCommunity] = await db
                .insert(community)
                .values(input)
                .returning();
            
            return newCommunity;
        })
})
