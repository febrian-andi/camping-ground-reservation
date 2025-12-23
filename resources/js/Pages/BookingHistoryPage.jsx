import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { History, Tent } from "lucide-react";
import { Button } from "@/Components/ui/button"; // shadcn
import { usePage } from "@inertiajs/react";

export default function BookingHistoryPage() {
    const { reservations } = usePage().props;

    // Dummy data jika props kosong
    const dummyReservations = reservations || [
        {
            id: 1,
            campsiteName: "Pine Forest Camp",
            campsiteImage: "https://picsum.photos/seed/camp3/800/600",
            blockName: "A1",
            guests: 2,
            checkIn: "2025-12-24",
            status: "Confirmed",
            totalPrice: 120,
        },
        {
            id: 2,
            campsiteName: "Lake View Camp",
            campsiteImage: "https://picsum.photos/seed/camp4/800/600",
            blockName: "B2",
            guests: 4,
            checkIn: "2025-12-28",
            status: "Paid",
            totalPrice: 240,
        },
    ];

    const reservationsToShow = dummyReservations;

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <History className="text-emerald-600" /> My Reservations
                </h1>

                {reservationsToShow.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Tent
                            className="mx-auto text-gray-300 mb-4"
                            size={48}
                        />
                        <h3 className="text-lg font-medium text-gray-900">
                            No bookings yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Time to plan your next escape into nature.
                        </p>
                        <Button onClick={() => alert("Go Explore")}>
                            Explore Campsites
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservationsToShow.map((res) => (
                            <div
                                key={res.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
                            >
                                <img
                                    src={res.campsiteImage}
                                    alt={res.campsiteName}
                                    className="w-full md:w-32 h-32 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                #{res.id}
                                            </span>
                                            <h3 className="text-lg font-bold">
                                                {res.campsiteName}
                                            </h3>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                res.status === "Confirmed" ||
                                                res.status === "Paid"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {res.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Check-in
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {res.checkIn}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Block
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {res.blockName}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Guests
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {res.guests} ppl
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Total
                                            </span>
                                            <span className="font-medium text-emerald-600">
                                                ${res.totalPrice}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="text-sm py-1.5 h-8"
                                        >
                                            Download Ticket
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-sm py-1.5 h-8"
                                        >
                                            View Policies
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
