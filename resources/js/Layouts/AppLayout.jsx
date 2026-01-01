import Navbar from "@/Components/Navbar";
import BottomNavigation from "@/Components/BottomNavigation";

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto p-4 pb-32 md:pb-8">
                {children}
            </main>

            <BottomNavigation />
        </div>
    );
}
