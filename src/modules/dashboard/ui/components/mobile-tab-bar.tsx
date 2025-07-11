"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, Compass, UsersRound, AtomIcon, Menu, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import { authClient } from "@/lib/auth-client"; // Adjust path if needed
import { ThemeToggle } from "@/components/ThemeToggle"; // Adjust the path if needed
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const tabs = [
	{ icon: HomeIcon, label: "Home", href: "/" },
	{ icon: Compass, label: "Discover", href: "/discover" },
	{ icon: UsersRound, label: "Community", href: "/community" },
	{ icon: AtomIcon, label: "AI", href: "/ai" },
	{ icon: Menu, label: "More", action: "menu" },
];

export function MobileTabBar() {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/sign-in");
				},
			},
		});
		setMenuOpen(false);
	};

	const handleCloseMenu = () => {
		setIsClosing(true);
		setTimeout(() => {
			setMenuOpen(false);
			setIsClosing(false);
		}, 300); // match animation duration
	};

	// Example: Replace with your actual user fetching logic
	const { data, isPending } = authClient.useSession(); // Or your actual user hook

	return (
		<>
			<nav
				className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center bg-muted/90 border border-border h-16 sm:h-20 w-[95vw] max-w-xl rounded-2xl shadow-xl px-2 sm:px-4 backdrop-blur-md xl:hidden"
			>
				{tabs.map((tab) => {
					if (tab.action === "menu") {
						return (
							<button
								key="menu"
								onClick={() => setMenuOpen(true)}
								className="flex flex-col items-center justify-center flex-1 h-full transition-all"
							>
								<Menu
									className={cn(
										"w-7 h-7 mb-1 transition-transform duration-300",
										menuOpen && "rotate-90 scale-125 text-primary"
									)}
								/>
								<span className="text-xs">More</span>
							</button>
						);
					}
					const active = pathname === tab.href;
					if (!tab.href) return null;
					return (
						<Link
							key={tab.href}
							href={tab.href}
							className={cn(
								"flex flex-col items-center justify-center flex-1 h-full transition-all",
								active ? "text-primary scale-110 font-bold" : "text-muted-foreground hover:text-primary"
							)}
						>
							<tab.icon className={cn("w-7 h-7 mb-1 transition-all", active && "scale-125")} />
							<span className={cn("text-xs transition-all", active && "font-bold text-base")}>
								{tab.label}
							</span>
						</Link>
					);
				})}
			</nav>
			{menuOpen && (
				<div className="fixed inset-0 z-50 bg-black/40 flex items-end xl:hidden transition-all duration-300">
					<div className={`w-full bg-white dark:bg-zinc-900 rounded-t-2xl p-6 relative ${isClosing ? "animate-slideDown" : "animate-slideUp"}`}>
						<button
							className="absolute top-4 right-6 text-5xl font-extrabold text-gray-900 dark:text-white transition-transform duration-200 hover:scale-110 z-50"
							onClick={handleCloseMenu}
							aria-label="Close menu"
						>
							×
						</button>
						{/* User Info */}
						{!isPending && data?.user && (
							<div className="flex flex-col items-center mb-2 mt-1">
								<Avatar className="w-14 h-14 mb-1 border-2 border-orange-500 flex items-center justify-center bg-gray-200 dark:bg-zinc-800">
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
								<span className="font-semibold text-lg text-gray-900 dark:text-white">{data.user.name}</span>
							</div>
						)}
						<div className="flex flex-col gap-3 mt-2">
							<Link
								href="/shop"
								className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-white dark:bg-gray-500 transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2"
								onClick={handleCloseMenu}
							>
								<ShoppingCart className="w-6 h-6" />
								Shop (Coming Soon)
							</Link>
							<button
								className="w-full py-3 rounded-xl font-bold text-lg bg-red-700 text-white transition-transform duration-150 active:scale-95"
								onClick={async () => {
									await handleLogout();
									handleCloseMenu();
								}}
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			)}
			<style jsx global>{`
				@keyframes slideUp {
					from {
						transform: translateY(100%);
					}
					to {
						transform: translateY(0);
					}
				}
				@keyframes slideDown {
					from {
						transform: translateY(0);
					}
					to {
						transform: translateY(100%);
					}
				}
				.animate-slideUp {
					animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}
				.animate-slideDown {
					animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}
			`}</style>
		</>
	);
}

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
	return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}