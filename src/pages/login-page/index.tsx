"use client";

import Swal from "sweetalert2";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { useAppDispatch } from "@/lib/redux/hook";
import { login } from "@/lib/redux/features/authSlice";
import { setCookie } from "cookies-next";
import { useState } from "react";

import { LoginSchema, ChangePasswordSchema } from "./schema";
import { Ilogin } from "./type";

import "./login.styles.css"

export default function Login() {
  const dispatch = useAppDispatch();
  const initialValues: Ilogin = { email: "", password: "" };

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resetToken, setResetToken] = useState("");

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
          ? "/eo-dashboard-page" 
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

  const requestPasswordReset = async (email: string) => {
    Swal.fire({
      title: "Processing...",
      html: "Please wait while we send the reset link",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/request-password-reset`, 
        { 
          email 
        });
      
      Swal.fire({
        title: "Success!",
        text: "Password reset link sent to your email",
        icon: "success",
        confirmButtonText: "OK",
      });
      setShowForgotPasswordModal(false);
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonText: "OK",
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
      });
      
      Swal.fire({
        title: "Success!",
        text: "Password reset successfully. You can now login with your new password.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setShowResetPasswordModal(false);
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Check if URL has token parameter (for email link)
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token && !showResetPasswordModal && !resetToken) {
      setResetToken(token);
      setShowResetPasswordModal(true);
    }
  }

  return (
    <div className="Login-Styles flex flex-col justify-center justify-items-center items-center gap-5">
      <h1 className="text-3xl font-bold">LOGIN FORM</h1>
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

      <p className="text-sm text-gray-500"
        > Don't have an account?{" "}
            <a href="/register" className="text-blue-900 hover:underline"
              > Register here
            </a>
      </p>

      <button 
        onClick={() => setShowForgotPasswordModal(true)}
        className="text-sm text-blue-900 hover:underline"
      >
        Forgot password?
      </button>
      
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <p className="mb-4"
              > Enter your email to receive a password reset link
            </p>

            <Formik
              initialValues={{ email: "" }}
              onSubmit={(values) => requestPasswordReset(values.email)}
            >
              {(props: FormikProps<{ email: string }>) => (
                <Form>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Your email"
                    className="w-full p-2 border rounded mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700"
                    > Send Reset Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(false)}
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                    > Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4"
              > Set New Password
            </h2>

            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={ChangePasswordSchema}
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
              {(props: FormikProps<{ newPassword: string; confirmPassword: string }>) => 
                (
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
                      <label className="block mb-2">
                        Confirm Password
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700"
                        > Reset Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetPasswordModal(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                        > Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              </div>
          </div>
        )}
      <br />
    </div>
  );
}