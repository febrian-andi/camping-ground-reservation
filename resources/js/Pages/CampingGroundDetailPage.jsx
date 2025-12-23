import React, { useState } from "react";
import {
    ArrowLeft,
    MapPin,
    CheckCircle2,
    Upload,
    CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/Layouts/AppLayout";

export default function CampingGroundDetailPage() {
    // --- Dummy selected campsite ---
    const selectedCampsiteDummy = {
        id: 1,
        name: "Sunny Camp",
        location: "Mountain Valley",
        image: "https://picsum.photos/seed/camp2/800/600",
        description:
            "A beautiful sunny campsite in the mountains, perfect for family and friends.",
        facilities: ["Toilet", "Water", "Electricity", "Fire Pit"],
        rules: ["No smoking", "No loud music", "No pets"],
        blocks: [
            {
                id: 1,
                name: "Block A",
                price: 50,
                isAvailable: true,
                capacity: 4,
            },
            {
                id: 2,
                name: "Block B",
                price: 60,
                isAvailable: false,
                capacity: 6,
            },
            {
                id: 3,
                name: "Block C",
                price: 55,
                isAvailable: true,
                capacity: 3,
            },
        ],
    };

    // --- States ---
    const [bookingStep, setBookingStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [bookingData, setBookingData] = useState({
        checkIn: "",
        checkOut: "",
        checkInTime: "",
        guests: 1,
        notes: "",
        paymentMethod: "TRANSFER", // or "ON_ARRIVAL"
        proofUploaded: false,
    });

    const PaymentMethod = {
        TRANSFER: "TRANSFER",
        ON_ARRIVAL: "ON_ARRIVAL",
    };

    // --- Dummy handlers ---
    const confirmReservation = () => {
        alert("Booking confirmed!");
        setBookingStep(4);
    };

    return (
        <AppLayout>
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500 pb-10 p-4">
                <button
                    onClick={() => alert("Back to home dummy")}
                    className="flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-sm">
                            <img
                                src={selectedCampsiteDummy.image}
                                alt="Main"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    {selectedCampsiteDummy.name}
                                </h1>
                                <div className="flex items-center gap-2 text-white/90">
                                    <MapPin size={18} />
                                    {selectedCampsiteDummy.location}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">
                                About this spot
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {selectedCampsiteDummy.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Facilities
                                    </h3>
                                    <ul className="space-y-1">
                                        {selectedCampsiteDummy.facilities.map(
                                            (f) => (
                                                <li
                                                    key={f}
                                                    className="text-sm text-gray-600 flex items-center gap-2"
                                                >
                                                    <CheckCircle2
                                                        size={14}
                                                        className="text-emerald-500"
                                                    />{" "}
                                                    {f}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Rules
                                    </h3>
                                    <ul className="space-y-1">
                                        {selectedCampsiteDummy.rules.map(
                                            (r) => (
                                                <li
                                                    key={r}
                                                    className="text-sm text-gray-600 flex items-center gap-2"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />{" "}
                                                    {r}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Flow */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            {bookingStep === 1 && (
                                <>
                                    <h3 className="text-xl font-bold mb-4">
                                        Select a Block
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {selectedCampsiteDummy.blocks.map(
                                            (block) => (
                                                <button
                                                    key={block.id}
                                                    disabled={
                                                        !block.isAvailable
                                                    }
                                                    onClick={() =>
                                                        setSelectedBlock(block)
                                                    }
                                                    className={`
                        p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center h-24
                        ${
                            !block.isAvailable
                                ? "bg-gray-100 border-transparent opacity-50 cursor-not-allowed"
                                : selectedBlock?.id === block.id
                                ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                                : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }
                      `}
                                                >
                                                    <span className="font-bold text-sm block mb-1">
                                                        {block.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        ${block.price}
                                                    </span>
                                                </button>
                                            )
                                        )}
                                    </div>
                                    <Button
                                        className="w-full"
                                        disabled={!selectedBlock}
                                        onClick={() => setBookingStep(2)}
                                    >
                                        Continue to Details
                                    </Button>
                                </>
                            )}

                            {/* Step 2: Trip Details */}
                            {bookingStep === 2 && selectedBlock && (
                                <>
                                    <h3 className="text-xl font-bold mb-2">
                                        Trip Details
                                    </h3>
                                    <div className="bg-emerald-50 p-3 rounded-lg mb-4 text-sm flex justify-between items-center">
                                        <span className="font-medium text-emerald-800">
                                            {selectedBlock?.name}
                                        </span>
                                        <button
                                            onClick={() => setBookingStep(1)}
                                            className="text-emerald-600 underline text-xs"
                                        >
                                            Change
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Check-in"
                                                type="date"
                                                value={bookingData.checkIn}
                                                onChange={(e) =>
                                                    setBookingData({
                                                        ...bookingData,
                                                        checkIn: e.target.value,
                                                    })
                                                }
                                            />
                                            <Input
                                                label="Check-out"
                                                type="date"
                                                value={bookingData.checkOut}
                                                onChange={(e) =>
                                                    setBookingData({
                                                        ...bookingData,
                                                        checkOut:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <Input
                                            label="Guests"
                                            type="number"
                                            min="1"
                                            max={selectedBlock?.capacity}
                                            value={bookingData.guests}
                                            onChange={(e) =>
                                                setBookingData({
                                                    ...bookingData,
                                                    guests: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                        />
                                        <Input
                                            label="Special Requests"
                                            placeholder="Near bathrooms, shade, etc."
                                            value={bookingData.notes}
                                            onChange={(e) =>
                                                setBookingData({
                                                    ...bookingData,
                                                    notes: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => setBookingStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={() => setBookingStep(3)}
                                            disabled={
                                                !bookingData.checkIn ||
                                                !bookingData.checkOut
                                            }
                                        >
                                            Payment
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* Step 3: Payment */}
                            {bookingStep === 3 && selectedBlock && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold mb-4">
                                        Confirm & Pay
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Dummy payment UI here...
                                    </p>
                                    <Button
                                        className="w-full"
                                        onClick={confirmReservation}
                                    >
                                        Confirm Booking
                                    </Button>
                                </div>
                            )}

                            {/* Step 4: Confirmation */}
                            {bookingStep === 4 && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2
                                            className="text-emerald-600"
                                            size={32}
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        Booking Confirmed!
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Your adventure awaits.
                                    </p>
                                    <Button
                                        className="w-full"
                                        onClick={() =>
                                            alert("Go to history dummy")
                                        }
                                    >
                                        View My Bookings
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
