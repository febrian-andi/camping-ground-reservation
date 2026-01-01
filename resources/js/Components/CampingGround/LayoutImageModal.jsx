import React from "react";
import { X } from "lucide-react";

export default function LayoutImageModal({
    isOpen,
    onClose,
    imageUrl,
    altText,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                onClick={onClose}
            >
                <X size={32} />
            </button>
            <img
                src={imageUrl}
                alt={altText || "Layout Fullscreen"}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
