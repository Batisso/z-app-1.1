import { Loader2Icon } from "lucide-react";

interface Props {
    title: string;
}

export const LoadingState = ({
    title,
}: Props) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-indigo-100 animate-pulse w-full max-w-md text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center">
                    <Loader2Icon className="size-12 animate-spin text-orange-700/40" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-700/40 to-yellow-600 bg-clip-text text-transparent mb-3">
                    {title}
                </h3>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-8"></div>
                <div className="h-12 bg-gray-300 rounded-xl w-48 mx-auto"></div>
            </div>
        </div>
    );
};
