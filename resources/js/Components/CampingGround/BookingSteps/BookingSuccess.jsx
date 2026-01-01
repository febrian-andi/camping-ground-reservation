import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccess() {
    return (
        <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Pemesanan Berhasil!</h3>
            <p className="text-gray-600 mb-6">
                Lokasi camping Anda sudah kami siapkan.
            </p>
            <Link href={route("booking-history")}>
                <Button className="w-full">Lihat Riwayat Pemesanan</Button>
            </Link>
        </div>
    );
}
