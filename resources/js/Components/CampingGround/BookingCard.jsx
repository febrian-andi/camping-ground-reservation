import React from "react";
import DateSelection from "./BookingSteps/DateSelection";
import BlockSelection from "./BookingSteps/BlockSelection";
import PaymentSelection from "./BookingSteps/PaymentSelection";
import BookingSuccess from "./BookingSteps/BookingSuccess";

export default function BookingCard({
    campground,
    bookingStep,
    setBookingStep,
    bookingData,
    setBookingData,
    selectedBlock,
    setSelectedBlock,
    confirmReservation,
    onOpenLayoutModal,
    errors,
    processing,
    unavailableBlockIds = [],
    checkAvailability,
    isCheckingAvailability = false,
}) {
    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div
                    className="relative group cursor-zoom-in"
                    onClick={onOpenLayoutModal}
                >
                    <img
                        src={`/storage/${campground?.camping_ground_layout?.layout_image}`}
                        alt={campground?.name}
                        className="w-full max-h-[400px] object-contain rounded-lg mb-1 transition-all group-hover:brightness-90"
                    />
                    <p className="text-[10px] text-gray-400 text-center mb-4 italic">
                        Klik gambar untuk memperbesar
                    </p>
                </div>

                {bookingStep === 1 && (
                    <DateSelection
                        bookingData={bookingData}
                        setBookingData={setBookingData}
                        checkAvailability={checkAvailability}
                        isCheckingAvailability={isCheckingAvailability}
                        errors={errors}
                        onNext={() => setBookingStep(2)}
                    />
                )}

                {bookingStep === 2 && (
                    <BlockSelection
                        bookingData={bookingData}
                        campground={campground}
                        selectedBlock={selectedBlock}
                        setSelectedBlock={setSelectedBlock}
                        unavailableBlockIds={unavailableBlockIds}
                        isCheckingAvailability={isCheckingAvailability}
                        onBack={() => setBookingStep(1)}
                        onNext={() => setBookingStep(3)}
                    />
                )}

                {bookingStep === 3 && selectedBlock && (
                    <PaymentSelection
                        bookingData={bookingData}
                        setBookingData={setBookingData}
                        selectedBlock={selectedBlock}
                        errors={errors}
                        processing={processing}
                        onBack={() => setBookingStep(2)}
                        onConfirm={confirmReservation}
                    />
                )}

                {bookingStep === 4 && <BookingSuccess />}
            </div>
        </div>
    );
}
