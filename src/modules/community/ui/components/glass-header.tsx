import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Menu } from "lucide-react";

interface GlassHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showCreateCommunity: boolean;
  setShowCreateCommunity: (show: boolean) => void;
  showCreatePost: boolean;
  setShowCreatePost: (show: boolean) => void;
  onCreateCommunityClick: () => void;
  onCreatePostClick: () => void;
  communityDialog: React.ReactNode;
  postDialog: React.ReactNode;
}

export const GlassHeader = ({
  sidebarOpen,
  setSidebarOpen,
  showCreateCommunity,
  setShowCreateCommunity,
  showCreatePost,
  setShowCreatePost,
  onCreateCommunityClick,
  onCreatePostClick,
  communityDialog,
  postDialog
}: GlassHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/20 rounded-lg lg:hidden transition-all duration-300 ease-in-out"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center shadow-md">
              <Users className="text-white font-bold text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                ZADULIS COMMUNITY
              </h1>
              <p className="text-xs opacity-70">Culture Circles</p>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end gap-3 mt-4 sm:mt-0">
            <Dialog open={showCreateCommunity} onOpenChange={setShowCreateCommunity}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 shadow-sm"
                  onClick={onCreateCommunityClick}
                >
                  <Plus className="w-4 h-4 " />
                  Circle
                </Button>
              </DialogTrigger>
              {communityDialog}
            </Dialog>
            <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 shadow-sm"
                  onClick={onCreatePostClick}
                >
                  <Plus className="w-4 h-4 mr" />
                  Post
                </Button>
              </DialogTrigger>
              {postDialog}
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};