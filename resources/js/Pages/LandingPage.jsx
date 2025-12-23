import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Tent,
    MapPin,
    Calendar,
    Star,
    Phone,
    Mail,
    Instagram,
    Facebook,
    Twitter,
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Head title="Welcome to CampNature" />

            {/* Navbar */}
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tent className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold tracking-tight">
                            CampNature
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <a
                            href="#features"
                            className="hover:text-primary transition-colors"
                        >
                            Fasilitas
                        </a>
                        <a
                            href="#locations"
                            className="hover:text-primary transition-colors"
                        >
                            Lokasi
                        </a>
                        <a
                            href="#testimonials"
                            className="hover:text-primary transition-colors"
                        >
                            Testimoni
                        </a>
                        <a
                            href="#contact"
                            className="hover:text-primary transition-colors"
                        >
                            Kontak
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop"
                        alt="Camping Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background"></div>
                </div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Temukan Ketenangan di{" "}
                        <span className="text-primary">Alam Bebas</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Nikmati pengalaman camping terbaik dengan fasilitas
                        lengkap dan pemandangan alam yang memukau. Reservasi
                        tempat camping impian Anda sekarang.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/booking"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            Booking Sekarang
                        </Link>
                        <a
                            href="#locations"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
                        >
                            Lihat Lokasi
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">
                            Kenapa Memilih Kami?
                        </h2>
                        <p className="text-muted-foreground">
                            Fasilitas terbaik untuk kenyamanan camping Anda.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <Tent className="h-10 w-10 text-primary" />
                                ),
                                title: "Tenda Premium",
                                description:
                                    "Sewa tenda berkualitas tinggi yang tahan air dan nyaman untuk segala cuaca.",
                            },
                            {
                                icon: (
                                    <MapPin className="h-10 w-10 text-primary" />
                                ),
                                title: "Lokasi Strategis",
                                description:
                                    "Spot camping dengan pemandangan terbaik, dekat sungai, dan akses mudah.",
                            },
                            {
                                icon: (
                                    <Star className="h-10 w-10 text-primary" />
                                ),
                                title: "Fasilitas Lengkap",
                                description:
                                    "Toilet bersih, listrik, wifi area, dan keamanan 24 jam tersedia.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery/Locations Section */}
            <section id="locations" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">
                            Pilihan Spot Camping
                        </h2>
                        <p className="text-muted-foreground">
                            Jelajahi berbagai lokasi menarik yang kami tawarkan.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=1998&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=2070&auto=format&fit=crop",
                        ].map((img, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-lg aspect-video"
                            >
                                <img
                                    src={img}
                                    alt={`Location ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-medium">
                                        Lihat Detail
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Siap untuk Petualangan Berikutnya?
                    </h2>
                    <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto">
                        Jangan lewatkan kesempatan untuk menikmati keindahan
                        alam. Pesan tempat Anda sekarang sebelum kehabisan!
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-primary hover:bg-background/90 h-12 px-8 text-lg"
                    >
                        Mulai Petualangan
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="py-12 bg-muted/30 border-t">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Tent className="h-6 w-6 text-primary" />
                                <span className="text-xl font-bold">
                                    CampNature
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Platform reservasi camping ground terbaik untuk
                                pengalaman outdoor yang tak terlupakan.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Tautan</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Beranda
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Tentang Kami
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Layanan
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Kontak
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Kontak</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" /> +62 812 3456
                                    7890
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />{" "}
                                    info@campnature.com
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Bogor, Jawa
                                    Barat
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Sosial Media</h3>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                        © 2024 CampNature. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
