import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { formatDateID, formatTimeHM } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import ReservationStatusBadge from "@/Components/ReservationStatusBadge";

export default function BookingDetailModal({ isOpen, onClose, bookingId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen || !bookingId) return;

        const fetchDetail = async () => {
            setLoading(true);

            try {
                const res = await axios.get(
                    route("api.user.booking.show", bookingId)
                );

                const bookingData = res.data;

                try {
                    bookingData.qrCodeUrl = route(
                        "api.user.booking.qrcode",
                        bookingData.reservation_number
                    );
                } catch (err) {
                    toast.warn("QR Code gagal dimuat");
                    bookingData.qrCodeUrl = null;
                }

                setData(bookingData);
            } catch (error) {
                toast.error("Gagal mengambil data reservasi");
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, bookingId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detail Reservasi</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap mengenai reservasi Anda.
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <div className="flex justify-center">
                        <Spinner className="w-8 h-8" />
                    </div>
                )}

                {!loading && error && (
                    <div className="flex justify-center">
                        <p className="text-red-500">
                            Terjadi kesalahan, coba lagi.
                        </p>
                    </div>
                )}

                {!loading && !error && data && (
                    <div className="space-y-4">
                        {/* QR CODE */}
                        <div className="flex justify-center pt-4 border-t mt-2">
                            <div className="text-center">
                                <div className="bg-white p-2 border rounded-lg inline-block">
                                    <img
                                        src={data.qrCodeUrl}
                                        alt="QR Code"
                                        className="w-32 h-32"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Tunjukkan QR Code ini saat check-in /
                                    check-out
                                </p>
                            </div>
                        </div>

                        {/* DETAIL */}
                        <div className="flex justify-between border-b pb-3">
                            <span>No. Reservasi</span>
                            <span className="font-mono font-bold">
                                #{data.reservation_number}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-3">
                            <span>Status Reservasi</span>
                            <ReservationStatusBadge
                                reservation={data}
                                type="reservation"
                            />
                        </div>
                        <div className="flex justify-between border-b pb-3">
                            <span>Status Pembayaran</span>
                            <ReservationStatusBadge
                                reservation={data}
                                type="payment"
                            />
                        </div>
                        <div className="flex justify-between border-b pb-3">
                            <span>Status Pembatalan</span>
                            <ReservationStatusBadge
                                reservation={data}
                                type="cancellation"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-b pb-3">
                            <div>
                                <span className="text-xs text-gray-500 block">
                                    Check-in
                                </span>
                                {formatDateID(data.check_in_date)}
                                <br />
                                {formatTimeHM(data.scheduled_check_in_time)} WIB
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">
                                    Check-out
                                </span>
                                {formatDateID(data.check_out_date)}
                                <br />
                                {formatTimeHM(
                                    data.scheduled_check_out_time
                                )}{" "}
                                WIB
                            </div>
                        </div>

                        <div className="flex justify-between pt-2">
                            <span className="font-bold">Total Biaya</span>
                            <span className="font-bold text-emerald-600">
                                Rp {data.total_price}
                            </span>
                        </div>

                        {/* STATUS HISTORY */}
                        {data.status_history?.length > 0 && (
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold text-sm mb-2">
                                    Riwayat Status
                                </h4>
                                <div className="space-y-3">
                                    {data.status_history.map((history) => (
                                        <div
                                            key={history.id}
                                            className="text-xs bg-gray-50 p-2 rounded border border-gray-100"
                                        >
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold capitalize">
                                                    {history.new_status}
                                                </span>
                                                <span className="text-gray-500">
                                                    {formatDateID(
                                                        history.created_at
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">
                                                {history.note}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PAYMENT HISTORY */}
                        {data.payments?.length > 0 && (
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold text-sm mb-2">
                                    Rincian Pembayaran
                                </h4>
                                <div className="space-y-2">
                                    {data.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex justify-between text-xs items-center bg-gray-50 bg-border-100 p-2"
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium uppercase block">
                                                    {payment.payment_provider} (
                                                    {payment.method})
                                                    {payment.proof_image && (
                                                        <a
                                                            href={`/storage/${payment.proof_image}`}
                                                            target="_blank"
                                                            className="italic underline capitalize ml-2 font-normal text-blue-500 hover:text-blue-700"
                                                        >
                                                            Bukti
                                                        </a>
                                                    )}
                                                </span>
                                                <span className="text-[10px] rounded-full">
                                                    {formatDateID(
                                                        payment.created_at
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono block">
                                                    Rp{" "}
                                                    {new Intl.NumberFormat(
                                                        "id-ID"
                                                    ).format(payment.amount)}
                                                </span>
                                                <Badge
                                                    variant={
                                                        payment.status ===
                                                        "verified"
                                                            ? "success"
                                                            : payment.status ===
                                                              "pending"
                                                            ? "warning"
                                                            : "destructive"
                                                    }
                                                    className="text-[10px] px-2 py-0.5"
                                                >
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
