import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, CheckCircle2, Upload } from "lucide-react";
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
    const PAYMENT_PROVIDER = {
        BCA: {
            name: "PT ABC BCA",
            number: "123456789",
        },
        BRI: {
            name: "PT ABC BRI",
            number: "123456789",
        },
        MANDIRI: {
            name: "PT ABC Mandiri",
            number: "123456789",
        },
        DANA: {
            name: "PT ABC Dana",
            number: "08123456789",
        },
        GOPAY: {
            name: "PT ABC GOPAY",
            number: "08123456789",
        },
        OVO: {
            name: "PT ABC OVO",
            number: "08123456789",
        },
    };
    const [previewUrl, setPreviewUrl] = React.useState(null);

    React.useEffect(() => {
        if (bookingData.proofImage) {
            const url = URL.createObjectURL(bookingData.proofImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [bookingData.proofImage]);

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
                        {bookingData.totalNights} Malam
                    </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-emerald-600 font-bold text-lg">
                        {formatIDR(bookingData.totalAmount)}
                    </span>
                </div>
            </div>

            {/* Select Payment Type */}
            <div className="space-y-4">
                <div className="space-y-3 mb-6">
                    <label
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                            bookingData.paymentType === "full_paid"
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            className="mr-3"
                            checked={bookingData.paymentType === "full_paid"}
                            onChange={() =>
                                setBookingData({
                                    ...bookingData,
                                    paymentType: "full_paid",
                                })
                            }
                        />
                        <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                                <CreditCard size={16} /> Bayar Lunas
                            </div>
                        </div>
                    </label>
                    <label
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                            bookingData.paymentType === "partial_paid"
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-gray-200"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            className="mr-3"
                            checked={bookingData.paymentType === "partial_paid"}
                            onChange={() =>
                                setBookingData({
                                    ...bookingData,
                                    paymentType: "partial_paid",
                                })
                            }
                        />
                        <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                                <CreditCard size={16} /> Bayar 50%
                            </div>
                            <div className="text-xs text-gray-500">
                                Pelunasan saat Check-in
                            </div>
                        </div>
                    </label>
                </div>

                {/* Select Payment Provider */}
                <div className="space-y-3 mb-6">
                    <h2 className="text-lg font-medium mb-2">
                        Pilih Metode Pembayaran
                    </h2>
                    {Object.entries(PAYMENT_PROVIDER).map(([key, value]) => (
                        <label
                            key={key}
                            className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                                bookingData.paymentProvider === key
                                    ? "border-emerald-500 bg-emerald-50"
                                    : "border-gray-200"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                className="mr-3"
                                checked={bookingData.paymentProvider === key}
                                onChange={() =>
                                    setBookingData({
                                        ...bookingData,
                                        paymentProvider: key,
                                    })
                                }
                            />
                            <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                    {key}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
                {bookingData.paymentProvider &&
                    PAYMENT_PROVIDER[bookingData.paymentProvider] && (
                        <div className="mb-6">
                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-3">
                                Silakan transfer ke: <br />
                                {bookingData.paymentProvider}
                                <span className="font-mono font-bold block mt-1">
                                    {
                                        PAYMENT_PROVIDER[
                                            bookingData.paymentProvider
                                        ].number
                                    }
                                </span>
                                <span className="font-mono mt-1 block">
                                    a.n{" "}
                                    {
                                        PAYMENT_PROVIDER[
                                            bookingData.paymentProvider
                                        ].name
                                    }
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
                                {previewUrl ? (
                                    <div className="text-emerald-600 flex flex-col items-center">
                                        <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={previewUrl}
                                                alt="Preview Bukti Transfer"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CheckCircle2
                                            size={32}
                                            className="mb-2"
                                        />
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
                                            Upload bukti transfer di sini
                                            (image, max 2MB)
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
                    disabled={processing || !bookingData.proofImage}
                >
                    {processing ? "Memproses..." : "Lanjutkan Pemesanan"}
                </Button>
            </div>
        </>
    );
}
