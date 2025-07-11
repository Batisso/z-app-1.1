import { Button } from "@/components/ui/button";

interface EmptyCirclesProps {
  onCreateClick: () => void;
  isMobile?: boolean;
}

export const EmptyCircles = ({ onCreateClick, isMobile = false }: EmptyCirclesProps) => {
  return (
    <div className="text-center py-3 px-2">
      <p className="text-sm text-gray-500 mb-3">You haven't created any circles yet</p>
      <Button 
        onClick={onCreateClick}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white"
      >
        Create Your First Circle
      </Button>
    </div>
  );
};

interface EmptyPostsProps {
  onCreateClick: () => void;
  isMobile?: boolean;
}

export const EmptyPosts = ({ onCreateClick, isMobile = false }: EmptyPostsProps) => {
  return (
    <div className="text-center py-3 px-2">
      <p className="text-sm text-white-500 mb-3">You haven't created any posts yet</p>
      <Button 
        onClick={onCreateClick}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white"
      >
        Create Your First Post
      </Button>
    </div>
  );
};