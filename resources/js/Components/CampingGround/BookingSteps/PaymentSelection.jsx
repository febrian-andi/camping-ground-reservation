import React from "react";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    CheckCircle2,
    Upload,
} from "lucide-react";
import { formatIDR, formatDateID } from "@/lib/utils";

export default function PaymentSelection({
    bookingData,
    setBookingData,
    selectedBlock,
    errors,
    processing,
    onBack,
    onConfirm,
}) {
    const PAYMENT_METHOD = {
        TRANSFER: "transfer",
        ON_ARRIVAL: "on_arrival",
    };

    return (
        <>
            <div className="flex items-center gap-2 mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto hover:bg-transparent"
                    onClick={onBack}
                >
                    <ArrowLeft size={16} />
                </Button>
                <h3 className="text-xl font-bold">Konfirmasi & Bayar</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3 shadow-sm">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Blok</span>
                    <span className="font-semibold">{selectedBlock.name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">
                        {formatDateID(bookingData.checkIn)}
                    </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">
                        {formatDateID(bookingData.checkOut)}
                    </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Durasi</span>
                    <span className="font-medium">
                        {bookingData.totalAmount / selectedBlock.daily_price}{" "}
                        Malam
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-emerald-600 font-bold text-lg">
                        {formatIDR(bookingData.totalAmount)}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-3 mb-6">
                    <label
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                            bookingData.paymentMethod ===
                            PAYMENT_METHOD.ON_ARRIVAL
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            className="mr-3"
                            checked={
                                bookingData.paymentMethod ===
                                PAYMENT_METHOD.ON_ARRIVAL
                            }
                            onChange={() =>
                                setBookingData({
                                    ...bookingData,
                                    paymentMethod: PAYMENT_METHOD.ON_ARRIVAL,
                                })
                            }
                        />
                        <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                                <MapPin size={16} /> Bayar di Lokasi
                            </div>
                            <div className="text-xs text-gray-500">
                                Cash/QRIS saat Check-in
                            </div>
                        </div>
                    </label>
                    <label
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                            bookingData.paymentMethod ===
                            PAYMENT_METHOD.TRANSFER
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            className="mr-3"
                            checked={
                                bookingData.paymentMethod ===
                                PAYMENT_METHOD.TRANSFER
                            }
                            onChange={() =>
                                setBookingData({
                                    ...bookingData,
                                    paymentMethod: PAYMENT_METHOD.TRANSFER,
                                })
                            }
                        />
                        <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                                <CreditCard size={16} /> Transfer Bank
                            </div>
                            <div className="text-xs text-gray-500">
                                Cek manual (1 hari)
                            </div>
                        </div>
                    </label>
                </div>
                {bookingData.paymentMethod === PAYMENT_METHOD.TRANSFER && (
                    <div className="mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-3">
                            Silakan transfer ke: <br />
                            <span className="font-mono font-bold">
                                BCA 123-456-7890
                            </span>
                            <br />
                            <span className="font-mono">
                                a.n CampConnect Indonesia
                            </span>
                        </div>
                        <input
                            type="file"
                            id="proof-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setBookingData({
                                        ...bookingData,
                                        proofImage: file,
                                        proofUploaded: true,
                                    });
                                }
                            }}
                        />
                        <label
                            htmlFor="proof-upload"
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer block"
                        >
                            {bookingData.proofImage ? (
                                <div className="text-emerald-600 flex flex-col items-center">
                                    <CheckCircle2 size={32} className="mb-2" />
                                    <span className="font-medium">
                                        {bookingData.proofImage.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Klik untuk ganti file
                                    </span>
                                </div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <Upload size={32} className="mb-2" />
                                    <span className="text-sm">
                                        Upload bukti transfer di sini (max 2MB)
                                    </span>
                                </div>
                            )}
                        </label>
                        {errors?.proof_image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.proof_image}
                            </p>
                        )}
                    </div>
                )}
                {errors?.message && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">
                        {errors.message}
                    </div>
                )}
                <Button
                    className="w-full"
                    onClick={onConfirm}
                    disabled={processing}
                >
                    {processing ? "Memproses..." : "Lanjutkan Pemesanan"}
                </Button>
            </div>
        </>
    );
}
