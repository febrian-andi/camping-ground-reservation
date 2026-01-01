import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { LogOut } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { router, usePage } from "@inertiajs/react";
import { formatDateID } from "@/lib/utils";

export default function ProfilePage() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const logout = () => {
        router.post("/logout");
    };

    return (
        <div className="p-4 animate-in fade-in duration-300">
            {user ? (
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
                            <span className="text-gray-500">Nomor Telepon</span>
                            <span className="font-medium text-gray-900">
                                {user?.phone_number || "-"}
                            </span>
                        </div>
                        <div className="flex justify-between p-4 bg-gray-50 rounded-2xl text-sm border border-gray-100">
                            <span className="text-gray-500">Member Since</span>
                            <span className="font-medium text-gray-900">
                                {formatDateID(user?.created_at) || "-"}
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full max-w-sm mt-8 py-3 rounded-xl flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white hover:text-white"
                    >
                        <LogOut size={18} /> Logout
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No User Data Found</p>
                </div>
            )}
        </div>
    );
}

ProfilePage.layout = (page) => <AppLayout>{page}</AppLayout>;
