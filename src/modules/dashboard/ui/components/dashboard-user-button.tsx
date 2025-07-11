import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, LogOutIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Separator } from "@/components/ui/separator";

export const DashboardUserButton = () => {
    const router = useRouter();
    const { data, isPending } = authClient.useSession();

    const onLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };



    if (isPending || !data?.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-gray-300 hover:bg-gray-300 transition-colors p-2 b-10 justify-center items-center flex">
                <Avatar className="w-9 h-9 mr-3 flex items-center justify-center bg-gray-200 dark:bg-zinc-800 border-orange-500 border-2">
                    <AvatarImage
                        src={data.user.image || undefined}
                        alt={data.user.name || "User"}
                    />
                    <AvatarFallback>
                        {data.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                        {data.user.name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                        {data.user.email}
                    </p>
                </div>
                <ChevronDown className="shrink-0 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end">
                <DropdownMenuLabel className="font-semibold">
                    <span className="font-medium truncate">{data.user.name}</span>
                    <br />
                    <span className="text-sm font-normal text-muted-foreground truncate">
                        {data.user.email}
                    </span>
                </DropdownMenuLabel>
                <Separator className="my-2" />
                <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer flex items-center justify-between"
                >
                    Sign Out
                    <LogOutIcon className="w-4 h-4 text-gray-500" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};