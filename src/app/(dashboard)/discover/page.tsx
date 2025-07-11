import { DiscoverView, DiscoverViewError, DiscoverViewLoading } from "@/modules/discover/ui/views/discover-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

const Page = async () => {
 const queryClient = getQueryClient();
 void queryClient.prefetchQuery(trpc.discover.getMany.queryOptions());

  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<DiscoverViewLoading/>}>
      <ErrorBoundary fallback={<DiscoverViewError/>}>
      <DiscoverView />
      </ErrorBoundary>
    </Suspense>
    
  </HydrationBoundary>
  );
};


export default Page;