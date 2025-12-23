import React from "react";
import { Tent, Compass, History, User, LogOut } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

export default function AppLayout({ children }) {
    // const { auth } = usePage().props; // ambil user dari Inertia props
    // const user = auth.user || { name: "Guest" };
    const user = { name: "Guest" };

    const logout = () => {
        // bisa pakai Inertia.post("/logout") atau dummy
        alert("Logout clicked");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-emerald-600 p-1.5 rounded-lg">
                            <Tent className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">
                            CampConnect
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <Link
                                href="/"
                                className="hover:text-emerald-600 transition-colors"
                            >
                                Explore
                            </Link>
                            <Link
                                href="/history"
                                className="hover:text-emerald-600 transition-colors"
                            >
                                My Bookings
                            </Link>
                        </nav>
                        <div className="flex items-center gap-3 pl-6 md:border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-gray-900">
                                    {user.name}
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                                {user.name[0]}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8 pb-32 md:pb-8">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 shadow-lg pb-[env(safe-area-inset-bottom)]">
                <Link
                    href="/"
                    className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-emerald-600"
                >
                    <Compass size={24} />
                    <span className="text-[10px] font-medium">Explore</span>
                </Link>
                <Link
                    href="/history"
                    className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-emerald-600"
                >
                    <History size={24} />
                    <span className="text-[10px] font-medium">Bookings</span>
                </Link>
                <Link
                    href="/profile"
                    className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-emerald-600"
                >
                    <User size={24} />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
