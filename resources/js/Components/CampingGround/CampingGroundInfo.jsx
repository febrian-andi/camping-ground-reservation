import React, { useRef } from "react";
import { MapPin, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import SafeHTML from "@/Components/SafeHTML";

export default function CampingGroundInfo({ campground }) {
    const scrollRef = useRef(null);

    const scrollGallery = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* ===================== GALLERY ===================== */}
            <div className="relative rounded-3xl overflow-hidden shadow-sm">
                <div className="relative group h-full">
                    {/* LEFT BUTTON */}
                    <button
                        type="button"
                        onClick={() => scrollGallery("left")}
                        className="absolute left-5 top-1/2 -translate-y-1/2 -translate-x-4
                            z-30 hidden md:flex items-center justify-center
                            border border-gray-400 bg-white/80 hover:bg-white
                            text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm
                            transition-all opacity-0 group-hover:opacity-100"
                        style={{ pointerEvents: "auto" }}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* SLIDER */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 h-full
                            overflow-x-auto no-scrollbar scroll-smooth
                            snap-x snap-mandatory"
                    >
                        {campground?.camping_ground_images?.map(
                            (img, index) => (
                                <div
                                    key={index}
                                    className="min-w-[300px] md:min-w-[350px]
                                        h-[360px] flex-shrink-0 snap-center
                                        relative rounded-3xl overflow-hidden
                                        shadow-md group/card cursor-pointer"
                                >
                                    <img
                                        src={`/storage/${img.image}`}
                                        alt={`Camping ground image ${
                                            index + 1
                                        }`}
                                        className="w-full h-full object-cover
                                            transition-transform duration-700
                                            group-hover/card:scale-105"
                                    />
                                </div>
                            )
                        )}
                    </div>

                    {/* RIGHT BUTTON */}
                    <button
                        type="button"
                        onClick={() => scrollGallery("right")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 translate-x-4
                            z-30 hidden md:flex items-center justify-center
                            border border-gray-400 bg-white/80 hover:bg-white
                            text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm
                            transition-all opacity-0 group-hover:opacity-100"
                        style={{ pointerEvents: "auto" }}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* OVERLAY INFO (NON-CLICKABLE) */}
                <div
                    className="absolute bottom-0 left-0 right-0 z-10
                        pointer-events-none
                        bg-gradient-to-t from-black/70 to-transparent p-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {campground.name}
                    </h1>
                    <div className="flex items-center gap-2 text-white/90">
                        <MapPin size={18} />
                        {campground.location}
                    </div>
                </div>
            </div>

            {/* ===================== DETAIL ===================== */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">
                    Tentang Lokasi Camping
                </h2>

                <div className="prose text-gray-600 leading-relaxed mb-6 text-justify max-w-none">
                    <SafeHTML html={campground.description} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* FACILITIES */}
                    <div>
                        <h3 className="font-semibold mb-2">Fasilitas</h3>
                        <ul className="space-y-1">
                            {campground?.facilities?.length > 0 ? (
                                campground.facilities.map((f, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm text-gray-600"
                                    >
                                        <CheckCircle2
                                            size={14}
                                            className="text-emerald-500"
                                        />
                                        {f.facility}
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-500">
                                    Tidak ada fasilitas
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* RULES */}
                    <div>
                        <h3 className="font-semibold mb-2">Peraturan</h3>
                        <ul className="space-y-1">
                            {campground?.rules?.length > 0 ? (
                                campground.rules.map((r, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm text-gray-600"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                        {r}
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-500">
                                    Tidak ada peraturan
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
