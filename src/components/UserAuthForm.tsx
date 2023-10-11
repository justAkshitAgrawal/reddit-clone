"use client";

import React, { FC, useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });
    } catch (error: any) {
      toast.error("There was an error signing in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size={"sm"}
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="h-5 w-5 mr-2" />}
        Sign in with Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
