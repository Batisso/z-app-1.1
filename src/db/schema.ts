import { nanoid} from "nanoid";
import { pgTable, text, timestamp, boolean, integer, unique } from "drizzle-orm/pg-core";
import { sqliteTable } from 'drizzle-orm/sqlite-core';

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
  });

  export const verification = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
  });

  export const discover = pgTable("discover", {
    id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
    name: text('name').notNull(),
    userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
    instructions: text('instructions').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  });

  
export const creators = pgTable('creators', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  slug: text('slug').notNull().unique(),
  discipline: text('discipline').notNull(),
  countryOfOrigin: text('country_of_origin').notNull(),
  basedIn: text('based_in').notNull(),
  bio: text('bio').notNull(),
  profilePhotoUrl: text('profile_photo_url').notNull(),
  socialLinks: text('social_links').notNull(), // Stored as JSON string
  styleTags: text('style_tags').notNull(), // Stored as JSON string
});
export const works = pgTable('works', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull().references(() => creators.id),
  url: text('url').notNull(),
});

export const community = pgTable("community", {
    id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    instructions: text('instructions'),
    image: text('image'),
    url: text('url'),
    userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  });

export const communityMembers = pgTable("community_members", {
    id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
    userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
    communityId: text('community_id')
    .notNull()
    .references(() => community.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
  }, (table) => ({
    uniqueCommunityMember: unique('unique_community_member').on(table.userId, table.communityId),
  }));


  export const ai = pgTable("ai", {
    id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
    name: text('name').notNull(),
    userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
    instructions: text('instructions').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  });


  export const shop = pgTable("shop", {
    id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
    name: text('name').notNull(),
    userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
    instructions: text('instructions').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  });



  

export const posts = pgTable("posts", {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  content: text('content'),
  url: text('url'),
  image: text('image'),
  tags: text('tags').array(),
  author: text('author'),
  author_image: text('author_image'),
  community_name: text('community_name'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  communityId: text('community_id').notNull().references(() => community.id, { onDelete: 'cascade' }),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  liked_by: text('liked_by').array().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const comments: any = pgTable("comments", {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  content: text('content').notNull(),
  author: text('author'),
  author_image: text('author_image'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  parentId: text('parent_id').references(() => comments.id, { onDelete: 'cascade' }),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  liked_by: text('liked_by').array().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const votes = pgTable("votes", {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'up' or 'down'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});