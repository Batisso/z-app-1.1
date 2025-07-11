import { CommunityViewError, CommunityViewLoading } from "@/modules/community/ui/views/community-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from 'react'
import { getQueryClient, trpc } from '@/trpc/server';
import { ErrorBoundary } from "react-error-boundary";
import { AiView } from '@/modules/ai/ui/views/ai-views';


const Page = async () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.community.getMany.queryOptions());
    const dehydratedState = dehydrate(queryClient);


    return (
        <HydrationBoundary state={dehydratedState}>
            <Suspense fallback={<CommunityViewLoading />}>
                <ErrorBoundary fallback={<CommunityViewError />}>
                    <AiView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page
