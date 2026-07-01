import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import authentication from "../appwrite/Auth";
import { useState } from "react";

export default function Layout() {

  const userData = useSelector((state) => state.auth.userData);
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    try {
      setSending(true);

      await authentication.sendVerificationEmail();

      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to send verification email.")
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex">
      <Header />

      <main className="flex-1 min-h-screen max-md:mt-15 bg-gray-100">
        {userData && !userData.emailVerification && (
          <div className="mx-4 mt-4 rounded-2xl border border-yellow-300 bg-yellow-50 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Verify your email
                </h3>

                <p className="text-sm text-yellow-700 mt-1">
                  Your email address isn't verified yet.
                  Please verify it to secure your account.
                </p>
              </div>

              <button
                onClick={handleResend}
                className="self-start rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-600"
              >
                Resend Email
              </button>
            </div>
          </div>
        )}
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}