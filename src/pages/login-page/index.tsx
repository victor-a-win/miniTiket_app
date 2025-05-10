"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { useAppDispatch } from "@/lib/redux/hook";
import { login } from "@/lib/redux/features/authSlice";
import { setCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";

import { LoginSchema } from "./schema";
import { Ilogin } from "./type";
import { useRouter } from "next/navigation";

import "./login.styles.css"

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValues: Ilogin = { email: "", password: "" };

  // State for reset password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);

  // Check for token in URL on component mount
  useEffect(() => {
    const token = searchParams?.get('token');
    if (token) {
      verifyResetToken(token);
    }
    
    // Clean up any residual reset state
    localStorage.removeItem('resetToken');
    sessionStorage.removeItem('resetToken');
  }, [searchParams]);

  const verifyResetToken = async (token: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-reset-token`,
        { token }
      );

      if (response.data.valid) {
        setResetToken(token);
        setIsValidToken(true);
        setShowResetModal(true);
    } else {
      throw new Error(response.data.error || "Invalid token");
    }
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.error || err.message || "Invalid or expired token",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
      // Clear the token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    });
  }
};

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
          token: resetToken,
          newPassword
        }
      );
      
      Swal.fire({
        title: "Success!",
        text: "Password reset successfully. You can now login with your new password.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setShowResetModal(false);
        // Clear the token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
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

  const onLogin = async (values: Ilogin) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        {
          ...values
        }
      );

      // Debugging: Log the API response
      console.log("Login API Response:", data); // Add this line

      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }

      // Set cookie with proper options
      setCookie('access_token', data.token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: false, // For localhost development
      });

      // Dispatch login with complete user data
      dispatch(login({ 
        user: {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          roleName: data.user.roleName
        }
      }));

      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "Cool",
        timer: 2000,
      }).then(() => {
      // Force reload to sync server and client state
      window.location.href = data.user.roleName.toLowerCase() === "event organizer" 
          ? "/eo-dashboard" 
          : "/";
      });
    } catch (err: any) {
      console.error("Login error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };
  
  return (
    <div className="Login-Styles flex flex-row justify-evenly gap-3 p-8">
      <div className="ml-16 mt-3">
        <img className="size-96 rounded-lg basis-96"
          src="login_page_pic_v2.jpg" alt="Login Picture"
        />
      </div>
    <div 
      className="basis-128 mt-2 
                flex flex-col justify-between justify-items-center items-center gap-3"
      >
      <h1 className="text-3xl font-bold pt-10"
        > LOGIN FORM
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
      >
        {(props: FormikProps<Ilogin>) => {
          const { isSubmitting, values, handleChange, touched, errors } = props;

          return (
            <Form className="w-full max-w-md">
              <div className="flex flex-col gap-2 mb-3">
                <label>Email :</label>
                <Field
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  className="p-2 border rounded"
                />
                {touched.email && errors.email ? (
                  <div className="text-red-500">*{errors.email}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label>Password :</label>
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                  className="p-2 border rounded"
                />
                {touched.password && errors.password ? (
                  <div className="text-red-500">*{errors.password}</div>
                ) : null}
              </div>

              <button 
                className={`w-full bg-blue-900 text-white py-2 px-4 rounded
                           hover:bg-blue-400 transition-colors
                           ${isSubmitting ? "opacity-50 cursor-not-allowed" 
                : ""}`}
                type="submit"
                disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          );
        }}
      </Formik>
      
      <button 
        onClick={() => router.push('/request-password-reset')}
        className="text-sm text-blue-600 hover:underline cursor-pointer"
        > Forgot password?
      </button>

      <p className="text-sm text-gray-500"
        > Don't have an account?{" "}
          <a href="/register" className="text-blue-900 hover:underline"
            > Register here
          </a>
      </p>
    </div>

    {/* Reset Password Modal */}
    {showResetModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
            
          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
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
                      onClick={() => {
                        setShowResetModal(false);
                        // Clear the token from URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                      }}
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
      )}
  </div>
  );
}