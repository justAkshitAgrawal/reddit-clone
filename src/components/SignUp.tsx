import React from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import UserAuthForm from "./UserAuthForm";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an Account
        </h1>
        <p className=" text-xs max-w-xs mx-auto">
          By continuing, you agree to our User Agreement and Privacy Policy.
        </p>

        {/* Sign In */}

        <UserAuthForm />

        {/* Sign Up Route */}

        <p className="px-8 text-center text-sm text-zinc-700">
          Already have an account?
          <Link
            href="/sign-in"
            className="hover:text-zinc-800 text-sm underline underline-offset-4 ml-2"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
