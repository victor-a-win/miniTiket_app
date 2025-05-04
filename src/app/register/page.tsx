"use client";

import Swal from "sweetalert2";
import { Formik, Form, Field, FormikProps } from "formik";
import axios from "axios";

import { RegisterSchema } from "./schema";
import { IRegister } from "./type";

export default function Register() {
  const initialValues: IRegister = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleId: 1, // Add an appropriate default value for roleId
    referred_by: "",
  };

  const onLogin = async (values: IRegister) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          email: values.email,
          password: values.password,
          first_name: values.firstName,
          last_name: values.lastName,
          roleI_d: values.roleId,
          referred_by: values.referred_by
        }
      );

      Swal.fire({
        title: data.message,
        icon: "success",
        confirmButtonText: "Cool",
        timer: 2000,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center justify-items-center items-center gap-5">
      <p className="text-4xl">REGISTER FORM</p>
      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          onLogin(values);
        }}
      >
        {(props: FormikProps<IRegister>) => {
          const { values, handleChange, touched, errors } = props;

          return (
            <Form>
              <div className="flex flex-col gap-4">
                <label>Email :</label>
                <Field
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
                {touched.email && errors.email ? (
                  <div className="text-red-500">*{errors.email}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">
                <label>Password :</label>
                <Field
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                />
                {touched.password && errors.password ? (
                  <div className="text-red-500">*{errors.password}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">
                <label>First Name :</label>
                <Field
                  type="firstName"
                  name="firstName"
                  onChange={handleChange}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName ? (
                  <div className="text-red-500">*{errors.firstName}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">
                <label>Last Name :</label>
                <Field
                  type="lastName"
                  name="lastName"
                  onChange={handleChange}
                  value={values.lastName}
                />
                {touched.lastName && errors.lastName ? (
                  <div className="text-red-500">*{errors.lastName}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">
                <label>Role ID :</label>
                <Field
                  type="roleId"
                  name="roleId"
                  onChange={handleChange}
                  value={values.roleId}
                />
                {touched.roleId && errors.roleId ? (
                  <div className="text-red-500">*{errors.roleId}</div>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">
                <label>Referred by :</label>
                <Field
                  type="referred_by"
                  name="referred_by"
                  onChange={handleChange}
                  value={values.referred_by}
                />
                {touched.referred_by && errors.referred_by ? (
                  <div className="text-red-500">*{errors.referred_by}</div>
                ) : null}
              </div>
              <button className="standard-button" type="submit">
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
