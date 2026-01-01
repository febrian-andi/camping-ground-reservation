import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { History, Tent } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Link, router } from "@inertiajs/react";
import { formatDateID, formatTimeHM } from "@/lib/utils";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useState } from "react";

export default function BookingHistoryPage({ reservations }) {
    const [cancelModal, setCancelModal] = useState({
        isOpen: false,
        reservationId: null,
    });
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelBooking = () => {
        if (!cancelModal.reservationId) return;

        setIsCancelling(true);
        router.post(
            route("booking.cancel"),
            {
                reservation_id: cancelModal.reservationId,
            },
            {
                onFinish: () => {
                    setIsCancelling(false);
                    setCancelModal({ isOpen: false, reservationId: null });
                },
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <History className="text-emerald-600" /> Riwayat Pemesanan
                </h1>

                {reservations?.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <Tent
                            className="mx-auto text-gray-300 mb-4"
                            size={48}
                        />
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
                ) : (
                    <div className="space-y-4">
                        {reservations.map((res) => (
                            <div
                                key={res.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                #{res.reservation_number}
                                            </span>
                                            <h3 className="text-lg font-bold">
                                                {res.camping_ground_name}
                                            </h3>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                [
                                                    "Confirmed",
                                                    "Completed",
                                                ].includes(res.status)
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : res.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : res.status === "Cancelled"
                                                    ? "bg-gray-100 text-gray-800"
                                                    : "bg-red-100 text-red-800"
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
                                                {`${formatDateID(
                                                    res.check_in_date
                                                )}, ${formatTimeHM(
                                                    res.scheduled_check_in_time
                                                )} WIB`}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Check-out
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {`${formatDateID(
                                                    res.check_out_date
                                                )}, ${formatTimeHM(
                                                    res.scheduled_check_out_time
                                                )} WIB`}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Block
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {res.block_name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 text-xs">
                                                Total
                                            </span>
                                            <span className="font-medium text-emerald-600">
                                                {`Rp ${res.total_price}`}
                                            </span>
                                            <span className="font-medium ml-2 text-gray-600">
                                                {`(${res.total_nights} malam)`}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Button
                                            onClick={() =>
                                                setCancelModal({
                                                    isOpen: true,
                                                    reservationId: res.id,
                                                })
                                            }
                                            disabled={res.status !== "Pending"}
                                            variant="destructive"
                                            className="mt-4 w-full"
                                        >
                                            {res.status === "Pending"
                                                ? "Batalkan Reservasi"
                                                : res.status === "Cancelled"
                                                ? "Dibatalkan"
                                                : "Tidak Dapat Dibatalkan"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={cancelModal.isOpen}
                onClose={() =>
                    setCancelModal({ isOpen: false, reservationId: null })
                }
                onConfirm={handleCancelBooking}
                title="Batalkan Reservasi?"
                message="Apakah Anda yakin ingin membatalkan reservasi ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Batalkan"
                cancelText="Kembali"
                isLoading={isCancelling}
            />
        </AppLayout>
    );
}
