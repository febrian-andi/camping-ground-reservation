import React from "react";
import { Compass, History, User } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function BottomNavigation() {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 shadow-lg pb-[env(safe-area-inset-bottom)]">
            <Link
                href="/explore"
                className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-emerald-600"
            >
                <Compass size={24} />
                <span className="text-[10px] font-medium">Jelajahi</span>
            </Link>
            <Link
                href="/booking-history"
                className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-emerald-600"
            >
                <History size={24} />
                <span className="text-[10px] font-medium">Pesanan Saya</span>
            </Link>
            <Link
                href="/profile"
                className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-emerald-600"
            >
                <User size={24} />
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>
    );
}
