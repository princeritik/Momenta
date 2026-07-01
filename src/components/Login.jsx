import { useForm } from "react-hook-form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import authentication from "../appwrite/Auth";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage";


export default function Login() {

    const navigate = useNavigate();
    const authStatus = useSelector(
        (state) => state.auth.status
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (authStatus) {
        return <Navigate to="/" />;
    }

    const onSubmit = async (data) => {
        setError("");
        setLoading(true);

        try {
            const session = await authentication.login({
                email: data.email,
                password: data.password,
            });

            if (!session) {
                toast.error("Invalid email or password");
                return;
            }

            const userData = await authentication.getCurrentUser();

            if (!userData) {
                toast.error("Unable to get user data");
                return;
            }

            dispatch(login(userData));
            toast.success("Login successful");
            navigate("/");

        } catch (error) {
            toast.error(getErrorMessage(error, "Login failed."));
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login
                </h2>
                {error && (
                    <p className="mb-4 text-sm text-red-500">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full border rounded-md px-3 py-2"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value:
                                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border rounded-md px-3 py-2"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message:
                                        "Password must be at least 6 characters long",
                                },
                            })}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="text-right mb-4">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Sign Up Link */}
                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}