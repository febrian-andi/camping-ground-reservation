import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { History } from "lucide-react";
import { router } from "@inertiajs/react";
import ConfirmationModal from "@/Components/ConfirmationModal";
import EmptyBookingState from "@/Components/BookingHistory/EmptyBookingState";
import BookingHistoryList from "@/Components/BookingHistory/BookingHistoryList";
import BookingDetailModal from "@/Components/BookingHistory/BookingDetailModal";
import { toast } from "sonner";

export default function BookingHistoryPage({ reservations }) {
    const [cancelModal, setCancelModal] = useState({
        isOpen: false,
        reservationId: null,
    });
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        data: null,
    });
    const [isCancelling, setIsCancelling] = useState(false);
    const [reason, setReason] = useState("");

    const handleCancelBooking = () => {
        if (!cancelModal.reservationId) return;
        if (reason.length === 0) {
            toast.error("Alasan pembatalan harus diisi");
            return;
        } else if (reason.length < 10) {
            toast.error("Alasan pembatalan minimal 10 karakter");
            return;
        }

        setIsCancelling(true);
        router.post(
            route("booking.cancel"),
            {
                reservation_id: cancelModal.reservationId,
                reason: reason,
            },
            {
                preserveScroll: true,

                onError: (errors) => {
                    if (errors.message) {
                        toast.error(errors.message);
                    } else {
                        toast.error("Gagal membatalkan reservasi");
                    }
                },

                onSuccess: () => {
                    toast.success("Permintaan pembatalan berhasil dikirim!");
                    setCancelModal({ isOpen: false, reservationId: null });
                    setReason("");
                },

                onFinish: () => {
                    setIsCancelling(false);
                },
            }
        );
    };

    return (
        <>
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <History className="text-emerald-600" /> Riwayat Pemesanan
                </h1>

                {reservations?.length === 0 ? (
                    <EmptyBookingState />
                ) : (
                    <BookingHistoryList
                        reservations={reservations}
                        onViewDetail={(data) =>
                            setDetailModal({ isOpen: true, data })
                        }
                        onCancel={(id) =>
                            setCancelModal({
                                isOpen: true,
                                reservationId: id,
                            })
                        }
                    />
                )}
            </div>

            <ConfirmationModal
                isOpen={cancelModal.isOpen}
                onClose={() =>
                    setCancelModal({ isOpen: false, reservationId: null })
                }
                reason={reason}
                onReasonChange={setReason}
                onConfirm={handleCancelBooking}
                title="Batalkan Reservasi?"
                message="Pengembalian dana hanya 50% dari total harga. Apakah Anda yakin ingin membatalkan reservasi ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Batalkan"
                cancelText="Kembali"
                isLoading={isCancelling}
            />

            <BookingDetailModal
                isOpen={detailModal.isOpen}
                onClose={() =>
                    setDetailModal((prev) => ({ ...prev, isOpen: false }))
                }
                bookingId={detailModal.data?.id}
            />
        </>
    );
}

BookingHistoryPage.layout = (page) => <AppLayout>{page}</AppLayout>;
