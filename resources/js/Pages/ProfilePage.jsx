import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { User, LogOut } from "lucide-react";
import { Button } from "@/Components/ui/button"; // kalau pakai shadcn
import { usePage } from "@inertiajs/react";

export default function ProfilePage() {
    //   const { auth, reservations } = usePage().props;
    //   const user = auth.user;
    const user = {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
    };

    const logout = () => {
        // Inertia logout
        // Inertia.post("/logout");
        alert("Logout clicked");
    };

    return (
        <AppLayout>
            <div className="p-4 animate-in fade-in duration-300">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <User className="text-emerald-600" /> My Profile
                </h1>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-3xl font-bold mb-4 shadow-inner">
                        {user?.name[0]}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name}
                    </h2>
                    <p className="text-gray-500 mb-8">{user?.email}</p>

                    <div className="w-full space-y-4 max-w-sm">
                        <div className="flex justify-between p-4 bg-gray-50 rounded-2xl text-sm border border-gray-100">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-medium text-gray-900">
                                {user?.phone}
                            </span>
                        </div>
                        <div className="flex justify-between p-4 bg-gray-50 rounded-2xl text-sm border border-gray-100">
                            <span className="text-gray-500">Member Since</span>
                            <span className="font-medium text-gray-900">
                                Jan 2024
                            </span>
                        </div>
                        <div className="flex justify-between p-4 bg-gray-50 rounded-2xl text-sm border border-gray-100">
                            <span className="text-gray-500">Bookings</span>
                            <span className="font-medium text-gray-900">5</span>
                        </div>
                    </div>

                    <Button
                        variant="danger"
                        onClick={logout}
                        className="w-full max-w-sm mt-8 py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} /> Logout
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
