"use client";

import Swal from "sweetalert2";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";

import { RegisterSchema } from "./schema";
import { IRegister } from "./type";

import "./register.styles.css";

export default function Register() {
  const initialValues: IRegister = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: 1 as number, // Default to role 1
    referred_by: "",
  };

  const onRegister = async (values: IRegister) => {
    // Show loading alert
    Swal.fire({
      title: "Processing...",
      html: "Please wait while we create your account",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          email: values.email,
          password: values.password,
          first_name: values.firstName,
          last_name: values.lastName,
          roleId: Number(values.roleId),
          referred_by: values.referred_by
        }
      );

      // Close loading and show success
      Swal.fire({
        title: "Registration Successful!",
        html: 
          `<div>
            <p>${data.message}</p>
              <div class="mt-4">
                We've sent an activation link to your email (${values.email}).
              </div>
              <div class="mt-2">
                Please check your inbox and click the activation link to verify your account.
              </div>
          </div>`
        ,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      // Close loading and show error
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
     <div className="Register-Styles flex flex-row justify-around p-2">
      <div className="mt-40">
        <img  className="size-96 rounded-lg basis-96"
          src="register_page_pic_v2.jpg" alt="Register Picture"
        />
      </div>
    <div 
      className="basis-128 mt-4 mb-2
                flex flex-col justify-center justify-items-center items-center gap-5"
      >
      <p className="text-3xl font-bold">REGISTER FORM</p>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          onRegister(values);
        }}
      >
        {(props: FormikProps<IRegister>) => {
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

              <div className="flex flex-col gap-2 mb-3">
                <label>First Name :</label>
                <Field
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                  value={values.firstName}
                  className="p-2 border rounded"
                />
                {touched.firstName && errors.firstName ? (
                  <div className="text-red-500">*{errors.firstName}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label>Last Name :</label>
                <Field
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  value={values.lastName}
                  className="p-2 border rounded"
                />
                {touched.lastName && errors.lastName ? (
                  <div className="text-red-500">*{errors.lastName}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label>Role :</label>
                <Field
                  as="select"
                  name="roleId"
                  onChange={handleChange}
                  value={values.roleId}
                  className="p-2 border rounded"
                >
                  <option value={1}>Role 1 (Customer)</option>
                  <option value={2}>Role 2 (Event Organizer)</option>
                </Field>
                {touched.roleId && errors.roleId ? (
                  <div className="text-red-500">*{errors.roleId}</div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <label>Referred by (optional) :</label>
                <Field
                  type="text"
                  name="referred_by"
                  onChange={handleChange}
                  value={values.referred_by}
                  className="p-2 border rounded"
                   placeholder="Example: TIX-NUMBERS"
                />
                {touched.referred_by && errors.referred_by ? (
                  <div className="text-red-500">*{errors.referred_by}</div>
                ) : null}
              </div>
              
              <button
                className={`w-full bg-blue-900 text-white py-2 px-4 rounded
                           hover:bg-blue-400 transition-colors 
                           ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          );
        }}
      </Formik>
      <p className="text-sm text-gray-500"
        > Already have an account? 
          <a href="/login" className="text-blue-900 hover:underline"
            > Login here
          </a>
      </p>
    </div>
  </div>
  );
}
