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
import { Textarea } from "./ui/textarea";

export default function ConfirmationModal({
    isOpen,
    onClose,
    reason,
    onReasonChange = () => {},
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
                    {onReasonChange && (
                        <div className="space-y-1">
                            <Textarea
                                type="text"
                                placeholder="Alasan pembatalan"
                                value={reason}
                                maxLength={120}
                                onChange={(e) => {
                                    onReasonChange(e.target.value);
                                }}
                                className="h-20"
                            />
                            <p className="text-xs text-left text-muted-foreground">
                                Sisa karakter: {120 - reason.length}
                            </p>
                        </div>
                    )}
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
