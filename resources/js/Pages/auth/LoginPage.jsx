import { Tent, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (errors.email) {
            toast.error(errors.email);
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <div className="bg-emerald-100 p-3 rounded-full">
                            <Tent className="text-emerald-600" size={32} />
                        </div>
                    </Link>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Selamat Datang
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Masuk untuk melanjutkan rencana camping Anda
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Alamat Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <div className="relative">
                        <Input
                            placeholder="Kata Sandi"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-3"
                        disabled={processing}
                    >
                        Masuk
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Belum punya akun? </span>
                    <Link
                        href="/register"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Daftar
                    </Link>
                </div>

                <div className="mt-2 text-center">
                    <Link
                        href="/forgot-password"
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        Lupa password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
