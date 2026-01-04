import React from "react";
import { Badge } from "@/Components/ui/badge";
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Banknote,
    Ban,
    CornerUpLeft,
} from "lucide-react";

export default function ReservationStatusBadge({
    reservation,
    type = "summary",
    className,
}) {
    const getStatusConfig = () => {
        // SUMMARY TYPE (Priority Logic from BookingHistoryList)
        if (type === "summary") {
            // Cancellation Requests Priority
            if (
                reservation.reservation_cancellation_request_status ===
                "pending"
            ) {
                return {
                    label: "Menunggu Pembatalan",
                    variant: "warning",
                    icon: Clock,
                };
            }
            if (
                reservation.reservation_cancellation_request_status ===
                "rejected"
            ) {
                return {
                    label: "Pembatalan Ditolak",
                    variant: "destructive",
                    icon: XCircle,
                };
            }
            if (
                reservation.reservation_cancellation_request_status ===
                "approved"
            ) {
                if (reservation.payment_status === "refunded") {
                    return {
                        label: "Dana Dikembalikan",
                        variant: "gray",
                        icon: CornerUpLeft,
                    };
                }
                return {
                    label: "Pembatalan Disetujui",
                    variant: "gray",
                    icon: CheckCircle2,
                };
            }

            // Fallback to Standard Status Logic
            return getStandardStatusConfig(
                reservation.status,
                reservation.payment_status
            );
        }

        // SPECIFIC TYPES
        if (type === "reservation") {
            return getStandardStatusConfig(
                reservation.status,
                reservation.payment_status,
                true
            );
        }

        if (type === "payment") {
            switch (reservation.payment_status) {
                case "pending":
                    return {
                        label: "Menunggu",
                        variant: "warning",
                        icon: Clock,
                    };
                case "full_paid":
                    return {
                        label: "Lunas",
                        variant: "success",
                        icon: CheckCircle2,
                    };
                case "partial_paid":
                    return {
                        label: "Bayar 50%",
                        variant: "success",
                        icon: Banknote,
                    };
                case "failed":
                    return {
                        label: "Gagal",
                        variant: "destructive",
                        icon: XCircle,
                    };
                default:
                    return {
                        label: "Unknown",
                        variant: "secondary",
                        icon: AlertCircle,
                    };
            }
        }

        if (type === "cancellation") {
            switch (reservation.reservation_cancellation_request_status) {
                case "pending":
                    return {
                        label: "Menunggu",
                        variant: "warning",
                        icon: Clock,
                    };
                case "rejected":
                    return {
                        label: "Ditolak",
                        variant: "destructive",
                        icon: XCircle,
                    };
                case "approved":
                    return {
                        label: "Disetujui",
                        variant: "gray",
                        icon: CheckCircle2,
                    };
                default:
                    return { label: "-", variant: "secondary", icon: null };
            }
        }

        return null;
    };

    const getStandardStatusConfig = (
        status,
        paymentStatus,
        simpleLabel = false
    ) => {
        switch (status) {
            case "pending":
                return {
                    label: simpleLabel ? "Menunggu" : "Menunggu Konfirmasi",
                    variant: "warning",
                    icon: Clock,
                };
            case "confirmed":
                if (simpleLabel) {
                    return {
                        label: "Terkonfirmasi",
                        variant: "success",
                        icon: CheckCircle2,
                    };
                }
                return paymentStatus === "full_paid"
                    ? {
                          label: "Terkonfirmasi Lunas",
                          variant: "success",
                          icon: CheckCircle2,
                      }
                    : {
                          label: "Terkonfirmasi Bayar 50%",
                          variant: "success",
                          icon: Banknote,
                      };
            case "completed":
                return {
                    label: "Selesai",
                    variant: "info",
                    icon: CheckCircle2,
                };
            case "cancelled":
                return {
                    label: "Dibatalkan",
                    variant: "gray",
                    icon: Ban,
                };
            case "rejected":
                return {
                    label: "Ditolak",
                    variant: "destructive",
                    icon: XCircle,
                };
            default:
                return {
                    label: "Unknown",
                    variant: "secondary",
                    icon: AlertCircle,
                };
        }
    };

    const config = getStatusConfig();

    if (!config || config.label === "-") {
        return (
            <Badge variant="secondary" className="py-1 px-3">
                -
            </Badge>
        );
    }

    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={`gap-1.5 py-1 px-3 ${className}`}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{config.label}</span>
        </Badge>
    );
}
