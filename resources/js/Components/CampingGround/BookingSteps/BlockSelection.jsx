import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatIDR, formatDateID } from "@/lib/utils";
import { Spinner } from "@/Components/ui/spinner";

export default function BlockSelection({
    bookingData,
    campground,
    selectedBlock,
    setSelectedBlock,
    unavailableBlockIds,
    isCheckingAvailability,
    onBack,
    onNext,
}) {
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
                <h3 className="text-xl font-bold">Pilih Blok</h3>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg mb-4 text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium text-emerald-800">
                        {`${formatDateID(bookingData.checkIn)} - ${
                            bookingData.checkInTime
                        } WIB`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium text-emerald-800">
                        {`${formatDateID(bookingData.checkOut)} - ${
                            bookingData.maxCheckOutTime
                        } WIB`}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 justify-center mb-6">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>{" "}
                    Tersedia
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-100 border border-emerald-500 rounded"></div>{" "}
                    Dipilih
                </span>
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div> Tidak
                    Tersedia
                </span>
            </div>

            {isCheckingAvailability ? (
                <div className="flex items-center justify-center mb-6 h-[100px] text-sm">
                    <Spinner className="mr-1" />
                    Mohon Tunggu...
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {campground?.blocks?.length > 0 ? (
                        campground?.blocks?.map((block) => {
                            const isUnavailable = unavailableBlockIds.some(
                                (id) => String(id) === String(block.id)
                            );
                            return (
                                <button
                                    key={block.id}
                                    disabled={
                                        !block.is_active ||
                                        isUnavailable ||
                                        isCheckingAvailability
                                    }
                                    onClick={() => setSelectedBlock(block)}
                                    className={`
                                        p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center min-h-[100px]
                                        ${
                                            !block.is_active || isUnavailable
                                                ? "bg-gray-300 border-transparent opacity-50 cursor-not-allowed"
                                                : selectedBlock?.id === block.id
                                                ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                                                : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                                        }
                                    `}
                                >
                                    <span className="font-bold text-sm block mb-1 line-clamp-1">
                                        {block.name}
                                    </span>
                                    <span className="text-xs text-gray-500 mb-1">
                                        {isUnavailable
                                            ? "Tidak Tersedia"
                                            : `${formatIDR(
                                                  block.daily_price
                                              )}/malam`}
                                    </span>
                                </button>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-sm text-gray-600 text-center py-4">
                            Tidak ada block tersedia
                        </div>
                    )}
                </div>
            )}
            <Button
                className="w-full"
                disabled={!selectedBlock}
                onClick={onNext}
            >
                Lanjut ke Pembayaran
            </Button>
        </>
    );
}
