import { Button } from "@/components/ui/button";

interface EmptyCirclesProps {
  onCreateClick: () => void;
}

export const EmptyCircles = ({ onCreateClick }: EmptyCirclesProps) => {
  return (
    <div className="text-center py-3 px-2">
      <p className="text-sm text-gray-500 mb-3">You haven't created any circles yet</p>
      <Button 
        onClick={onCreateClick}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      >
        Create Your First Circle
      </Button>
    </div>
  );
};

interface EmptyPostsProps {
  onCreateClick: () => void;
}

export const EmptyPosts = ({ onCreateClick }: EmptyPostsProps) => {
  return (
    <div className="text-center py-3 px-2">
      <p className="text-sm text-gray-500 mb-3">You haven't created any posts yet</p>
      <Button 
        onClick={onCreateClick}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
      >
        Create Your First Post
      </Button>
    </div>
  );
};