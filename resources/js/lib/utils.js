import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classnames
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to ID (dd-mm-yyyy)
 * @param {string} date - Date to format
 * @returns {string} - Date in format "dd-mm-yyyy"
 */
export function formatDateID(date) {
    if (!date) return "-";

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(parsedDate);
}

/**
 * Format number to IDR
 * @param {number} value - Number to format
 * @returns {string} - Number in format "Rp X"
 */
export function formatIDR(value) {
    if (!value) return "Rp -";

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

/**
 * Convert time to minutes
 * @param {string} time - Time in format "HH:MM"
 * @returns {number} - Minutes
 */
export function timeToMinutes(time) {
    if (!time) return 0;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

/**
 * Convert minutes to time
 * @param {number} minutes - Minutes to convert
 * @returns {string} - Time in format "HH:MM"
 */
export function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Format time string "HH:MM:SS" menjadi "HH.MM"
 * @param {string} time - Waktu dalam format "HH:MM:SS"
 * @returns {string} - Waktu dalam format "HH.MM"
 */
export function formatTimeHM(time) {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}.${minutes}`;
}
