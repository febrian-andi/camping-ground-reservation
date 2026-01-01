import { useState } from "react";
import { Tent, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone_number: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register");
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
                    Buat Akun
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Daftar untuk menemukan spot yang ideal
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Full Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}

                    <Input
                        placeholder="Nomor Telepon"
                        type="tel"
                        value={data.phone_number}
                        onChange={(e) =>
                            setData(
                                "phone_number",
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        required
                    />
                    {errors.phone_number && (
                        <p className="text-red-500 text-sm">
                            {errors.phone_number}
                        </p>
                    )}

                    <Input
                        placeholder="Alamat Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}

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
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password}
                        </p>
                    )}

                    <div className="relative">
                        <Input
                            placeholder="Konfirmasi Kata Sandi"
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? (
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
                        Daftar
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Sudah punya akun? </span>
                    <Link
                        href="/login"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Masuk
                    </Link>
                </div>
            </div>
        </div>
    );
}
