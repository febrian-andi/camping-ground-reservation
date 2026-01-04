import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Tent } from "lucide-react";

export default function EmptyBookingState() {
    return (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Tent className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900">
                Tidak ada data
            </h3>
            <p className="text-gray-500 mb-6">
                Anda belum memiliki riwayat pemesanan.
            </p>
            <Link href={route("explore")}>
                <Button>Cari Tempat</Button>
            </Link>
        </div>
    );
}
