import { Link } from "@inertiajs/react";
import { useRef } from "react";
import {
    Tent,
    Sparkles,
    Compass,
    Shield,
    Camera,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { usePage } from "@inertiajs/react";

export default function LandingView() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const hasAnyRole = (...roles) =>
        user?.roles?.some((r) =>
            roles.map((role) => role.toLowerCase()).includes(r.toLowerCase())
        );

    const isAdmin = hasAnyRole("admin", "super_admin");

    const scrollRef = useRef(null);
    const scrollGallery = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const galleryImages = [
        {
            src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            src: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        },
        {
            src: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        },
        {
            src: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        },
        {
            src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-600 p-1.5 rounded-lg">
                        <Tent className="text-white" size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">
                        CampConnect
                    </span>
                </div>

                <div className="flex gap-4">
                    {user ? (
                        <a href={isAdmin ? "/admin" : "/explore"}>
                            <Button
                                variant="outline"
                                className="hover:bg-emerald-600 hover:text-white"
                            >
                                Dashboard
                            </Button>
                        </a>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    className="hover:bg-emerald-600 hover:text-white"
                                >
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button>Daftar</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="relative flex-1 flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-emerald-50/50 to-white z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        className="w-full h-full object-cover opacity-50"
                        alt="Camping"
                    />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                        <Sparkles size={14} />
                        Teman Camping Pintar Kamu
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
                        Jelajahi Surga <br />
                        <span className="text-emerald-600">
                            Tersembunyi Indonesia
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 md:px-12">
                        Temukan spot camping impianmu dari hutan pinus sampai
                        tepi danau yang syahdu.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/explore">
                            <Button className="py-4 px-8 text-lg rounded-xl shadow-lg shadow-emerald-200">
                                Lihat Lokasi
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Kenapa Pilih CampConnect?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Feature
                            icon={<Compass size={24} />}
                            title="Pilihan Terbaik"
                            text="Lokasi camping terbaik, aman, dan Instagramable."
                            color="emerald"
                        />
                        <Feature
                            icon={<Sparkles size={24} />}
                            title="Ranger AI"
                            text="Tanya apa saja soal camping 24/7."
                            color="blue"
                        />
                        <Feature
                            icon={<Shield size={24} />}
                            title="Transaksi Aman"
                            text="Booking cepat, aman, dan tanpa ribet."
                            color="purple"
                        />
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 flex items-center justify-center gap-3">
                            <Camera className="text-emerald-600" /> Momen Seru
                            di Alam
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Intip keseruan teman-teman komunitas CampConnect.
                            Dijamin bikin kamu pengen langsung <i>packing</i>!
                        </p>
                    </div>

                    <div className="relative group">
                        {/* Left Button */}
                        <button
                            onClick={() => scrollGallery("left")}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 border border-gray-400 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hidden md:flex items-center justify-center"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Slider Container */}
                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-2"
                        >
                            {galleryImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="min-w-[300px] md:min-w-[350px] h-[450px] relative rounded-3xl overflow-hidden shadow-md flex-shrink-0 snap-center group/card cursor-pointer"
                                >
                                    <img
                                        src={img.src}
                                        alt={img.title}
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Right Button */}
                        <button
                            onClick={() => scrollGallery("right")}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 border border-gray-400 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hidden md:flex items-center justify-center"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Camping Nyaman di Alam Terbaik Kami
                    </h2>
                    <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                        Nikmati pengalaman camping di lokasi pilihan yang kami
                        kelola secara langsung. Tenang, aman, dan cocok untuk
                        berbagai kebutuhan liburan.
                    </p>
                    <Link href="/explore">
                        <Button
                            variant="outline"
                            className="py-3 px-8 text-lg text-black hover:bg-black hover:text-white"
                        >
                            Pesan Sekarang
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 text-white mb-4">
                            <Tent size={20} />
                            <span className="font-bold text-xl">
                                CampConnect
                            </span>
                        </div>
                        <p className="text-sm max-w-xs">
                            Jembatan buat kamu yang rindu alam dan pengen
                            liburan tanpa ribet.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Jelajahi
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>Destinasi Hits</li>
                            <li>Aktivitas Seru</li>
                            <li>Cerita Petualang</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Bantuan
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>Pusat Bantuan</li>
                            <li>Tips Aman</li>
                            <li>Kebijakan Refund</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Feature({ icon, title, text, color }) {
    const colorMap = {
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorMap[color]}`}
            >
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-600">{text}</p>
        </div>
    );
}
