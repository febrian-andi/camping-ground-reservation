import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Spinner } from "@/Components/ui/spinner";

export default function DateSelection({
    bookingData,
    setBookingData,
    checkAvailability,
    isCheckingAvailability,
    errors,
    onNext,
}) {
    const handleCheckAvailability = async () => {
        if (checkAvailability) {
            await checkAvailability();
        }
        onNext();
    };

    return (
        <>
            <h3 className="text-xl font-bold mb-4">Rencana Penyewaan</h3>
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Check-in</label>
                        <Input
                            type="date"
                            value={bookingData.checkIn}
                            onChange={(e) =>
                                setBookingData({
                                    ...bookingData,
                                    checkIn: e.target.value,
                                })
                            }
                        />
                        {errors?.check_in_date && (
                            <p className="text-red-500 text-xs">
                                {errors.check_in_date}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Check-out</label>
                        <Input
                            type="date"
                            value={bookingData.checkOut}
                            onChange={(e) =>
                                setBookingData({
                                    ...bookingData,
                                    checkOut: e.target.value,
                                })
                            }
                        />
                        {errors?.check_out_date && (
                            <p className="text-red-500 text-xs">
                                {errors.check_out_date}
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">
                        Jam Check-in (WIB)
                    </label>
                    <div className="flex items-center gap-2">
                        <select
                            className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                !bookingData.checkInTime &&
                                    "text-muted-foreground"
                            )}
                            value={
                                bookingData.checkInTime
                                    ? bookingData.checkInTime.split(":")[0]
                                    : ""
                            }
                            onChange={(e) => {
                                const newHour = e.target.value;
                                const currentMinute = bookingData.checkInTime
                                    ? bookingData.checkInTime.split(":")[1]
                                    : "00";
                                setBookingData({
                                    ...bookingData,
                                    checkInTime: `${newHour}:${currentMinute}`,
                                });
                            }}
                        >
                            <option value="" disabled>
                                Jam
                            </option>
                            {Array.from({ length: 24 }).map((_, i) => {
                                const hour = String(i).padStart(2, "0");
                                return (
                                    <option key={hour} value={hour}>
                                        {hour}
                                    </option>
                                );
                            })}
                        </select>
                        <span className="font-bold">:</span>
                        <select
                            className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                !bookingData.checkInTime &&
                                    "text-muted-foreground"
                            )}
                            value={
                                bookingData.checkInTime
                                    ? bookingData.checkInTime.split(":")[1]
                                    : ""
                            }
                            onChange={(e) => {
                                const newMinute = e.target.value;
                                const currentHour = bookingData.checkInTime
                                    ? bookingData.checkInTime.split(":")[0]
                                    : "14";
                                setBookingData((prev) => ({
                                    ...prev,
                                    checkInTime: `${currentHour}:${newMinute}`,
                                }));
                            }}
                        >
                            <option value="" disabled>
                                Menit
                            </option>
                            {Array.from({ length: 12 }).map((_, i) => {
                                const minute = String(i * 5).padStart(2, "0");
                                return (
                                    <option key={minute} value={minute}>
                                        {minute}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">
                        Jam Check-out (WIB)
                    </label>
                    <Input
                        value={bookingData.maxCheckOutTime || ""}
                        readOnly
                        className="bg-gray-100 text-muted-foreground w-full cursor-not-allowed"
                        placeholder="--:--"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Sesuai ketentuan, check-out maksimal 21 jam dari jam
                        check-in.
                    </p>
                </div>
            </div>
            <Button
                className="w-full"
                disabled={
                    isCheckingAvailability ||
                    !bookingData.checkIn ||
                    !bookingData.checkOut ||
                    !bookingData.checkInTime
                }
                onClick={handleCheckAvailability}
            >
                {isCheckingAvailability && <Spinner className="mr-1" />}
                Cek Ketersediaan Blok
            </Button>
        </>
    );
}
