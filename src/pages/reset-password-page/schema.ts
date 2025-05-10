import * as Yup from "yup";

export const ChangePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(3, "Password must be 3 characters at minimum")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Incorrect Password"
    )
    .required("New Password cannot be empty"),
  confirmPassword: Yup.string()
    .required("Confirm Password must be filled saame as New Password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});