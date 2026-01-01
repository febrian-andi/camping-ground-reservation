import React, { useState, useMemo } from "react";
import { Tent, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/Layouts/AppLayout";
import { formatIDR } from "@/lib/utils";
import { Link } from "@inertiajs/react";

export default function ExplorePage({ campgrounds }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCampsites = useMemo(() => {
        return campgrounds.filter((camp) =>
            camp.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <AppLayout>
            <div className="space-y-6 animate-in fade-in duration-500 p-4">
                {/* Hero */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Tent className="text-emerald-600" />
                        Temukan Lokasi Camping Terbaik
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-3 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Cari lokasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampsites.map((camp) => (
                        <Link
                            key={camp.id}
                            href={route("camping-ground-detail", camp.slug)}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={`/storage/${camp.camping_ground_images[0].image}`}
                                    alt={camp.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                                    Mulai dari {formatIDR(camp.base_price)}
                                    /malam
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {camp.name}
                                </h3>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                    <MapPin size={14} />
                                    {camp.location}
                                </div>
                                <div className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                    <>{camp.shortDescription}</>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-auto group-hover:bg-emerald-700 group-hover:text-white hover:bg-emerald-700 hover:text-white"
                                >
                                    View Details
                                </Button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
