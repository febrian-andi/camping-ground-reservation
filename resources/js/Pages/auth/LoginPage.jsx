import { Tent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function LoginPage() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login"); // endpoint login di Laravel
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
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Login to manage your camping adventures
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <Button
                        type="submit"
                        className="w-full py-3"
                        disabled={processing}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">
                        Don't have an account?{" "}
                    </span>
                    <Link
                        href="/register"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Sign up
                    </Link>
                </div>

                <div className="mt-2 text-center">
                    <Link
                        href="/forgot-password"
                        className="text-xs text-gray-400 hover:text-gray-600"
                    >
                        Forgot password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
