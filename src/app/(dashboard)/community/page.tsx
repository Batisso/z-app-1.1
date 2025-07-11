import { CommunityView, CommunityViewError, CommunityViewLoading } from "@/modules/community/ui/views/community-view";
import React, { Suspense } from 'react'
import { ErrorBoundary } from "react-error-boundary";

const Page = () => {
    return (
        <Suspense fallback={<CommunityViewLoading />}>
            <ErrorBoundary fallback={<CommunityViewError />}>
                <CommunityView />
            </ErrorBoundary>
        </Suspense>
    )
}

export default Page;
