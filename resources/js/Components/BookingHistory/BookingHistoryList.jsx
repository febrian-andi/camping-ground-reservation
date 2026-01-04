import React from "react";
import { Button } from "@/Components/ui/button";
import { formatDateID, formatTimeHM } from "@/lib/utils";
import ReservationStatusBadge from "@/Components/ReservationStatusBadge";

export default function BookingHistoryList({
    reservations,
    onViewDetail,
    onCancel,
}) {
    return (
        <div className="space-y-4">
            {reservations.map((res) => (
                <div
                    key={res.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6"
                >
                    <div className="flex-1">
                        <div className="sm:hidden block mb-1 flex justify-end">
                            <ReservationStatusBadge reservation={res} />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    #{res.reservation_number}
                                </span>
                                <h3 className="text-lg font-bold">
                                    {res.camping_ground_name}
                                </h3>
                            </div>
                            <div className="hidden sm:block">
                                <ReservationStatusBadge reservation={res} />
                            </div>
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
                        <div className="flex justify-center gap-2">
                            <Button
                                onClick={() => onViewDetail(res)}
                                variant="outline"
                                className="mt-4 w-full hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
                            >
                                Lihat Detail
                            </Button>
                            {res.reservation_cancellation_request_status ===
                                null &&
                                res.status !== "completed" &&
                                res.status !== "rejected" && (
                                    <Button
                                        onClick={() => onCancel(res.id)}
                                        variant="destructive"
                                        className="mt-4 w-full"
                                    >
                                        Ajukan Pembatalan
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
