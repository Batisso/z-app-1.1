import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view"
import { redirect } from "next/navigation";



const Page = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/sign-in");
    }

    return <HomeView />;
  } catch (error) {
    // Handle database connection errors
    if (error instanceof Error && (error.message.includes('NeonDbError') || error.message.includes('fetch failed'))) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Connection Error</h1>
            <p className="text-gray-600">
              Sorry, we're having trouble connecting to the database. Please refresh the page to try again.
            </p>
            <a 
              href="/dashboard"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </a>
          </div>
        </div>
      );
    }
    
    // Re-throw other errors
    throw error;
  }
};

export default Page;