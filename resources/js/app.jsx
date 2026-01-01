import "./bootstrap";
import "../css/app.css";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { Toaster } from "sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        duration: 3000,
                        className:
                            "bg-white text-gray-900 border border-gray-200 shadow-lg",
                        classNames: {
                            success:
                                "bg-emerald-50 text-emerald-800 border-emerald-200",
                            error: "bg-red-50 text-red-800 border-red-200",
                            warning:
                                "bg-yellow-50 text-yellow-800 border-yellow-200",
                        },
                    }}
                />
            </>
        );
    },
    progress: {
        color: "#376f35ff",
    },
});
