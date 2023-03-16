import { Form, Formik } from "formik";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoginInput from "../../components/inputs/loginInput";
import * as Yup from "yup";
import axios from "axios";
export default function ChangePassword({
  password,
  setPassword,
  conf_password,
  setConf_password,
  error,
  laoding,
  setLoading,
  userInfos,
  setError,
}) {
  const navigate = useNavigate();
  const validatePassword = Yup.object({
    password: Yup.string()
      .required(
        "Enter a combination of at least 8 characters with one uppercase letter, one lowercase, one number or special character)."
      )
      .min(8, "Password must be at least 8 characters.")
      .max(36, "Password can't be more than 36 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-+])/,
            "at least one uppercase letter, one lowercase, one number or special character",
      ),

    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });
  const { email } = userInfos;
  const changePassword = async () => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`, {
        email,
        password,
      });
      setError("");
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="reset_form" style={{ height: "310px" }}>
      <div className="reset_form_header">Change Password</div>
      <div className="reset_form_text">Pick a strong password</div>
      <Formik
        enableReinitialize
        initialValues={{
          password,
          conf_password,
        }}
        validationSchema={validatePassword}
        onSubmit={() => {
          changePassword();
        }}
      >
        {(formik) => (
          <Form>
            <LoginInput
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
            <LoginInput
              type="password"
              name="conf_password"
              onChange={(e) => setConf_password(e.target.value)}
              placeholder="Confirm new password"
              bottom
            />
            {error && <div className="error_text">{error}</div>}
            <div className="reset_form_btns">
              <Link to="/login" className="gray_btn">
                Cancel
              </Link>
              <button type="submit" className="blue_btn">
                Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
