import React from "react";
import { Tent } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
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
                            href="/explore"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            Jelajahi
                        </Link>
                        <Link
                            href="/booking-history"
                            className="hover:text-emerald-600 transition-colors"
                        >
                            Pesanan Saya
                        </Link>
                    </nav>
                    <div className="pl-6 md:border-l border-gray-200">
                        <Link href="/profile">
                            <div className="flex items-center gap-3 ">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-bold text-gray-900">
                                        {user.name}
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                                    {user.name[0]}
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
