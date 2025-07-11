import { ShopView } from "@/modules/shop/ui/views/shop-view";

import { getQueryClient, trpc } from "@/trpc/server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";


const shopPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.shop.getMany.queryOptions());


  return (
  
  <HydrationBoundary state={dehydrate(queryClient)}>
  <Suspense>
  <ShopView/>
  </Suspense>
  </HydrationBoundary>

  );


};
 

export default shopPage;