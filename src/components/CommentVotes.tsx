"use client";

import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/Button";

type PartialVote = Pick<CommentVote, "type">;

interface CommentVotesProps {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: PartialVote;
}

const CommentVotes: FC<CommentVotesProps> = ({
  initialVotesAmt,
  commentId,
  initialVote,
}) => {
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      };

      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },

    onError: (err: any, voteType) => {
      if (voteType === "UP") {
        setVotesAmt((prev) => prev - 1);
      } else {
        setVotesAmt((prev) => prev + 1);
      }

      setCurrentVote(prevVote);

      toast.error(err.response.data);
    },

    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") {
          setVotesAmt((prev) => prev - 1);
        } else {
          setVotesAmt((prev) => prev + 1);
        }
      } else {
        setCurrentVote({ type });
        if (type === "UP") {
          setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        } else {
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        onClick={() => {
          vote("UP");
        }}
        size="sm"
        variant={"ghost"}
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-orange-500 fill-orange-500": currentVote?.type === "UP",
          })}
        />
      </Button>

      <p className=" text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      <Button
        onClick={() => {
          vote("DOWN");
        }}
        size="sm"
        variant={"ghost"}
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-orange-500 fill-orange-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
