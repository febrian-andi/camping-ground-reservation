import React, { useState, useMemo } from "react";
import { Tent, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/Layouts/AppLayout";

export default function ExplorePage() {
    // --- Dummy data ---
    const campsitesDummy = [
        {
            id: "camp-1",
            name: "Pine Valley Retreat",
            location: "Yosemite, CA",
            priceStart: 45,
            shortDescription:
                "Serene forest camping with breathtaking mountain views.",
            description:
                "Pine Valley Retreat offers a secluded escape into nature. Nestled among towering pine trees, this campsite is perfect for hikers and nature lovers. Enjoy direct access to trails and a crystal-clear creek running through the property.",
            image: "https://picsum.photos/seed/camp1/800/600",
            images: [
                "https://picsum.photos/seed/camp1-1/800/600",
                "https://picsum.photos/seed/camp1-2/800/600",
                "https://picsum.photos/seed/camp1-3/800/600",
            ],
            facilities: [
                "Free Wi-Fi",
                "Hot Showers",
                "Fire Pits",
                "General Store",
            ],
            rules: [
                "Quiet hours 10 PM - 7 AM",
                "No open fires outside pits",
                "Pets must be leashed",
            ],
        },
        {
            id: "camp-2",
            name: "Lakeside Haven",
            location: "Tahoe, NV",
            priceStart: 60,
            shortDescription:
                "Waterfront camping perfect for kayaking and fishing enthusiasts.",
            description:
                "Wake up to the sound of gentle waves at Lakeside Haven. Our premium spots offer direct water access. Rent kayaks on-site or just relax by the shore. Family-friendly with a dedicated play area.",
            image: "https://picsum.photos/seed/camp2/800/600",
            images: [
                "https://picsum.photos/seed/camp2-1/800/600",
                "https://picsum.photos/seed/camp2-2/800/600",
            ],
            facilities: [
                "Boat Launch",
                "Fishing Deck",
                "BBQ Grills",
                "Clean Restrooms",
            ],
            rules: [
                "No swimming after sunset",
                "Catch and release fishing only",
                "Alcohol in designated areas only",
            ],
        },
        {
            id: "camp-3",
            name: "Desert Star Oasis",
            location: "Moab, UT",
            priceStart: 55,
            shortDescription:
                "Unmatched stargazing opportunities in the heart of the desert.",
            description:
                "Experience the magic of the desert at night. Desert Star Oasis is a certified dark sky park, offering some of the best stargazing in the country. During the day, explore the unique red rock formations.",
            image: "https://picsum.photos/seed/camp3/800/600",
            images: [
                "https://picsum.photos/seed/camp3-1/800/600",
                "https://picsum.photos/seed/camp3-2/800/600",
            ],
            facilities: [
                "Telescope Rentals",
                "Water Refill Station",
                "Solar Showers",
                "Guided Tours",
            ],
            rules: [
                "Pack in, pack out trash",
                "Stay on marked trails",
                "No drones",
            ],
        },
    ];

    // --- States ---
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState(200);

    // --- Filtered campsites ---
    const filteredCampsites = useMemo(() => {
        return campsitesDummy.filter(
            (camp) =>
                camp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                camp.priceStart <= priceFilter
        );
    }, [searchTerm, priceFilter]);

    // --- Dummy handler ---
    const initiateBooking = (camp) => {
        alert(`View details for: ${camp.name}`);
        // nanti bisa pakai Inertia.visit(`/camping/${camp.id}`);
    };

    return (
        <AppLayout>
            <div className="space-y-6 animate-in fade-in duration-500 p-4">
                {/* Hero / Filter Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Tent className="text-emerald-600" />
                        Find Your Next Adventure
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-3 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                            />
                        </div>
                        <div className="md:w-64 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                Max Price: ${priceFilter}
                            </span>
                            <input
                                type="range"
                                min="20"
                                max="200"
                                value={priceFilter}
                                onChange={(e) =>
                                    setPriceFilter(Number(e.target.value))
                                }
                                className="w-full accent-emerald-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampsites.map((camp) => (
                        <div
                            key={camp.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={camp.image}
                                    alt={camp.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
                                    From ${camp.priceStart}/night
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
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                    {camp.shortDescription}
                                </p>
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    {camp.facilities.slice(0, 3).map((f) => (
                                        <span
                                            key={f}
                                            className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => initiateBooking(camp)}
                                    className="w-full mt-auto group-hover:bg-emerald-700 group-hover:text-white hover:bg-emerald-700 hover:text-white"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
