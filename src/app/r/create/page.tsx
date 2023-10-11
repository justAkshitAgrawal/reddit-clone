"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "sonner";

const CreatePage = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      try {
        const { data } = await axios.post("/api/subreddit", payload);
        toast.success("Community created successfully");
        return data as string;
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data);
      }
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className=" container flex items-center h-full max-w-3xl mx-auto">
      <div className=" relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className=" text-xl font-semibold">Create a new Community</h1>
        </div>

        <hr className=" bg-zinc-500 h-px" />

        <div>
          <p className=" text-lg font-medium">Name</p>
          <p className=" text-xs pb-2">
            {`Community names can't be changed later.`}
          </p>
        </div>

        <div className=" relative">
          <p className=" absolute texsm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
            r/
          </p>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pl-6"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={() => router.back()} variant={"subtle"}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
            variant={"default"}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
