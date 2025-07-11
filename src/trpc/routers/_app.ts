import { discoverRouter } from '@/modules/discover/server/procedures';
import { createTRPCRouter } from '../init';
import { communityRouter } from '@/modules/community/server/procedures';
import { community, shop } from '@/db/schema';
import { aiRouter } from '@/modules/ai/server/procedures';
import { shopRouter } from '@/modules/shop/server/procedures';

export const appRouter = createTRPCRouter({

 discover: discoverRouter,
 community: communityRouter,    
 ai: aiRouter,
 shop: shopRouter
 
});

// export type definition of API
export type AppRouter = typeof appRouter;