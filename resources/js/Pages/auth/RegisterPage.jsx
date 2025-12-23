import { Tent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function RegisterPage() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register"); // endpoint register di Laravel
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-emerald-100 p-3 rounded-full">
                        <Tent className="text-emerald-600" size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Join us to find your perfect spot
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
                        placeholder="Phone Number"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        required
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}

                    <Input
                        placeholder="Email Address"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}

                    <Input
                        placeholder="Password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password}
                        </p>
                    )}

                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full py-3"
                        disabled={processing}
                    >
                        Register
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">
                        Already have an account?{" "}
                    </span>
                    <Link
                        href="/login"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
