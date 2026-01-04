import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import { timeToMinutes, minutesToTime } from "@/lib/utils";
import CampingGroundInfo from "@/Components/CampingGround/CampingGroundInfo";
import BookingCard from "@/Components/CampingGround/BookingCard";
import LayoutImageModal from "@/Components/CampingGround/LayoutImageModal";
import { toast } from "sonner";

export default function CampingGroundDetailPage({ campground }) {
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        checkIn: "",
        checkOut: "",
        checkInTime: "",
        maxCheckOutTime: "",
        notes: "",
        totalAmount: 0,
        totalNights: 0,
        paymentType: "full_paid",
        paymentMethod: "transfer",
        paymentProvider: "BCA",
        proofUploaded: false,
        proofImage: null,
    });

    const [unavailableBlockIds, setUnavailableBlockIds] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    const CHECKOUT_LIMIT_HOURS = 21;

    useEffect(() => {
        if (!data.checkInTime) {
            setData((prev) => ({
                ...prev,
                maxCheckOutTime: "",
            }));
            return;
        }

        const checkInMinutes = timeToMinutes(data.checkInTime);
        const maxMinutes = (checkInMinutes + CHECKOUT_LIMIT_HOURS * 60) % 1440;

        setData((prev) => ({
            ...prev,
            maxCheckOutTime: minutesToTime(maxMinutes),
        }));
    }, [data.checkInTime]);

    const checkAvailability = () => {
        if (data.checkIn && data.checkOut) {
            setIsCheckingAvailability(true);
            return axios
                .get(route("api.user.booking.check-availability"), {
                    params: {
                        check_in_date: data.checkIn,
                        check_out_date: data.checkOut,
                        scheduled_check_in_time: data.checkInTime,
                        camping_ground_id: campground.id,
                    },
                })
                .then((response) => {
                    setUnavailableBlockIds(response.data.unavailable_block_ids);
                })
                .catch((error) => {
                    console.error("Failed to check availability", error);
                })
                .finally(() => {
                    setIsCheckingAvailability(false);
                });
        }
    };

    function calculateNights(checkIn, checkOut) {
        if (!checkIn || !checkOut) return 0;

        const nights = Math.max(
            Math.ceil(
                (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
            ),
            1
        );

        return nights;
    }

    function calculateTotal(block, totalNights) {
        if (!block || !totalNights) return 0;

        if (data.paymentType === "partial_paid") {
            return block.daily_price * totalNights * 0.5;
        } else {
            return block.daily_price * totalNights;
        }
    }

    useEffect(() => {
        const nights = calculateNights(data.checkIn, data.checkOut);
        const total = calculateTotal(selectedBlock, nights);

        if (nights === 0 || total === 0) return;

        setData((prev) => ({
            ...prev,
            totalNights: nights,
            totalAmount: total,
        }));
    }, [selectedBlock, data.checkIn, data.checkOut, data.paymentType]);

    const confirmReservation = () => {
        transform((data) => ({
            ...data,
            block_id: selectedBlock?.id,
            check_in_date: data.checkIn,
            check_out_date: data.checkOut,
            scheduled_check_in_time: data.checkInTime,
            payment_type: data.paymentType,
            payment_method: data.paymentMethod,
            payment_provider: data.paymentProvider,
            proof_image: data.proofImage,
        }));

        if (data.proofUploaded && data.proofImage) {
            post(route("booking.store"), {
                onSuccess: () => {
                    setBookingStep(4);
                },
                onError: (errors) => {
                    toast.error("Reservasi Gagal. Silahkan coba lagi.");
                },
            });
        } else {
            toast.error("Silahkan upload bukti pembayaran.");
        }
    };

    return (
        <>
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500 pb-10 p-4">
                <Link href={route("explore")}>
                    <Button variant="ghost">
                        <ArrowLeft size={18} /> Kembali
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Column: Info */}
                    <CampingGroundInfo campground={campground} />

                    {/* Right Column: Booking Flow */}
                    <BookingCard
                        campground={campground}
                        bookingStep={bookingStep}
                        setBookingStep={setBookingStep}
                        bookingData={data}
                        setBookingData={setData}
                        selectedBlock={selectedBlock}
                        setSelectedBlock={setSelectedBlock}
                        confirmReservation={confirmReservation}
                        onOpenLayoutModal={() => setIsLayoutModalOpen(true)}
                        errors={errors}
                        processing={processing}
                        unavailableBlockIds={unavailableBlockIds}
                        checkAvailability={checkAvailability}
                        isCheckingAvailability={isCheckingAvailability}
                    />
                </div>
            </div>

            {/* Layout Image Modal */}
            <LayoutImageModal
                isOpen={isLayoutModalOpen}
                onClose={() => setIsLayoutModalOpen(false)}
                imageUrl={`/storage/${campground?.camping_ground_layout?.layout_image}`}
                altText={campground?.name}
            />
        </>
    );
}

CampingGroundDetailPage.layout = (page) => <AppLayout>{page}</AppLayout>;
