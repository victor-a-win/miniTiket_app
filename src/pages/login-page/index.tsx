"use client";

import Swal from "sweetalert2";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";
import { useAppDispatch } from "@/lib/redux/hook";
import { login } from "@/lib/redux/features/authSlice";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { LoginSchema } from "./schema";
import { Ilogin } from "./type";

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const initialValues: Ilogin = { email: "", password: "" };

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

  return (
    <div className="flex flex-col justify-center justify-items-center items-center gap-5">
      <p className="text-4xl">LOGIN FORM</p>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
      >
        {(props: FormikProps<Ilogin>) => {
          const { values, handleChange, touched, errors } = props;

          return (
            <Form className="w-full max-w-md">
              <div className="flex flex-col gap-4 mb-4">
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

              <div className="flex flex-col gap-4 mb-4">
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
                className="w-full bg-sky-500 text-white py-2 px-4 rounded
                           hover:bg-blue-600 transition-colors"
                type="submit"
                >
                  Login
              </button>
            </Form>
          );
        }}
      </Formik>
      <br />
    </div>
  );
}
