"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentValidatorType } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentValidatorType) => {
      const payload: CommentValidatorType = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.post("/api/subreddit/post/comment", payload);
      return data;
    },
    onError: (err: any) => {
      toast.error(err.response.data);
    },
    onSuccess: () => {
      toast.success("Comment posted!");
      router.refresh();
      setInput("");
    },
  });

  return (
    <div className=" grid w-full gap-1.5">
      <Label htmlFor="comment"> Your comment </Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are your thoughts?"
          rows={1}
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            onClick={() => {
              comment({ postId, text: input, replyToId });
            }}
            disabled={input.length === 0}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
