"use client";

import React, { startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubredditSubscriptionsPayload } from "@/lib/validators/subreddit";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName,
}: {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}) => {
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubredditSubscriptionsPayload = {
        subredditId: subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast.success(`Subscribed to r/${subredditName}!`);
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubredditSubscriptionsPayload = {
        subredditId: subredditId,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (error: any) => {
      toast.error(error.response.data);
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast.success(`Unsubsribed from r/${subredditName}!`);
    },
  });

  return isSubscribed ? (
    <Button
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
      className=" w-full mt-1 mb-4"
    >
      Leave this community
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => subscribe()}
      className=" w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
