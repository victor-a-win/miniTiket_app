"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";
import axios from "axios";

// import { ChangePasswordSchema } from "./schema";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);

  // Check token on component mount
  useEffect(() => {
    const urlToken = searchParams?.get("token");
    
    if (!urlToken) {
      Swal.fire({
        title: "Error!",
        text: "Invalid password reset link",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    // Verify token validity
    const verifyToken = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-reset-token`,
          { token: urlToken }
        );
        setToken(urlToken);
        setIsValidToken(true);
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Invalid or expired token",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/login");
        });
      }
    };

    verifyToken();
  }, [searchParams, router]);

  const handlePasswordReset = async (newPassword: string) => {
    Swal.fire({
      title: "Processing...",
      html: "Please wait while we reset your password",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/reset-password`, 
        {
          token,
          newPassword
        }
      );
      
      Swal.fire({
        title: "Success!",
        text: "Password reset successfully. You can now login with your new password.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear any residual state
        localStorage.removeItem('resetToken');
        sessionStorage.removeItem('resetToken');
        router.push("/login");
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!isValidToken) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4"
            >Verifying token...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4"
          >Set New Password
        </h2>
        
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          // validationSchema={ChangePasswordSchema}
          onSubmit={(values) => {
            if (values.newPassword === values.confirmPassword) {
              handlePasswordReset(values.newPassword);
            } else {
              Swal.fire({
                title: "Error!",
                text: "Passwords don't match",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }}
        > 
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block mb-2">New Password</label>
                <Field
                  type="password"
                  name="newPassword"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}