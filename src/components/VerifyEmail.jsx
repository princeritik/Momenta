import React, { useEffect, useState } from "react";
import { useSearchParams, Link, } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";


import authentication from "../appwrite/Auth";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const dispatch = useDispatch()

    useEffect(() => {
        const verify = async () => {
            const userId = searchParams.get("userId");
            const secret = searchParams.get("secret");

            if (!userId || !secret) {
                setStatus("failed");
                return;
            }

            try {
                await authentication.verifyEmail({ userId, secret });

                toast.success("Email verified successfully!");
                setStatus("success");
                const userData = await authentication.getCurrentUser();

                if (userData) {
                    dispatch(login(userData));
                }
            } catch (error) {

                toast.error("Verification link is invalid or expired.");
                setStatus("failed");
            }
        };

        verify();
    }, [searchParams, dispatch]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Verifying your email...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full">

                {status === "success" ? (
                    <>
                        <CheckCircle
                            size={70}
                            className="mx-auto text-green-500"
                        />

                        <h2 className="text-2xl font-bold mt-4">
                            Email Verified
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your account is now verified.
                        </p>
                    </>
                ) : (
                    <>
                        <XCircle
                            size={70}
                            className="mx-auto text-red-500"
                        />

                        <h2 className="text-2xl font-bold mt-4">
                            Verification Failed
                        </h2>

                        <p className="text-gray-500 mt-2">
                            This verification link is invalid or has expired.
                        </p>
                    </>
                )}

                <Link
                    to="/"
                    className="inline-block mt-8 bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}