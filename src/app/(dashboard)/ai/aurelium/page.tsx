import  AureliumView from "@/modules/ai/ui/pages/aurelium";

import { getQueryClient, trpc } from "@/trpc/server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";


const shopPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.shop.getMany.queryOptions());


  return (
  
  <HydrationBoundary state={dehydrate(queryClient)}>
  <Suspense>
  <AureliumView/>
  </Suspense>
  </HydrationBoundary>

  );


};
 

export default shopPage;