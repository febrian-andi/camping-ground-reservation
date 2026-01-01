import React from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    isLoading = false,
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Memproses..." : confirmText}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
