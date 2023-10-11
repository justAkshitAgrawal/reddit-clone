"use client";

import { Username, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UserNameForm = ({ user }: { user: Pick<User, "id" | "username"> }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Username>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  const router = useRouter();

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: Username) => {
      const payload: Username = { name };

      const { data } = await axios.patch(`/api/username`, payload);
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response.data?.message);
    },
    onSuccess: () => {
      toast.success("Username changed successfully!");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((e) => {
        updateUsername(e);
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Change Username</CardTitle>
          <CardDescription>Please enter a new username.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className=" sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register("name")}
            />

            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button isLoading={isLoading}>Change Name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;
