import React from "react";
import { Link } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

function ResetPasswordPage() {
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="mb-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your new password to complete the password reset process
          </p>
        </div>
        <div className="mt-8">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
