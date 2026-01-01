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
        paymentMethod: "ON_ARRIVAL",
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

    // useEffect(() => {
    //     if (data.checkIn && data.checkOut) {
    //         setIsCheckingAvailability(true);
    //         axios
    //             .get(route("booking.check-availability"), {
    //                 params: {
    //                     check_in_date: data.checkIn,
    //                     check_out_date: data.checkOut,
    //                     scheduled_check_in_time: data.checkInTime,
    //                     camping_ground_id: campground.id,
    //                 },
    //             })
    //             .then((response) => {
    //                 setUnavailableBlockIds(response.data.unavailable_block_ids);
    //             })
    //             .catch((error) => {
    //                 console.error("Failed to check availability", error);
    //             })
    //             .finally(() => {
    //                 setIsCheckingAvailability(false);
    //             });
    //     }
    // }, [data.checkIn, data.checkOut, data.checkInTime, campground.id]);

    const checkAvailability = () => {
        if (data.checkIn && data.checkOut) {
            setIsCheckingAvailability(true);
            return axios
                .get(route("booking.check-availability"), {
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

    function calculateTotal(block, checkIn, checkOut) {
        if (!block || !checkIn || !checkOut) return 0;

        const nights = Math.max(
            Math.ceil(
                (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
            ),
            1
        );

        return block.daily_price * nights;
    }

    useEffect(() => {
        const total = calculateTotal(
            selectedBlock,
            data.checkIn,
            data.checkOut
        );

        setData((prev) => ({
            ...prev,
            totalAmount: total,
        }));
    }, [selectedBlock, data.checkIn, data.checkOut]);

    const confirmReservation = () => {
        transform((data) => ({
            ...data,
            check_in_date: data.checkIn,
            check_out_date: data.checkOut,
            block_id: selectedBlock?.id,
            payment_method:
                data.paymentMethod === "TRANSFER" ? "transfer" : "on_arrival",
            proof_image: data.proofImage,
            scheduled_check_in_time: data.checkInTime,
        }));

        post(route("booking.store"), {
            onSuccess: () => {
                setBookingStep(4);
            },
            onError: (errors) => {
                toast.error("Reservasi Gagal. Silahkan coba lagi.");
            },
        });
    };

    return (
        <AppLayout>
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
        </AppLayout>
    );
}
