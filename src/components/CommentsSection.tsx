import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import React from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className=" w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((comment) => {
            const commentVotesAmt = comment.votes.reduce((acc, vote) => {
              if (vote.type === "UP") return acc + 1;
              if (vote.type === "DOWN") return acc - 1;
              return acc;
            }, 0);

            const commentVotes = comment.votes.find((vote) => {
              vote.userId === session?.user?.id;
            });
            return (
              <div key={comment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={comment}
                    currentVote={commentVotes}
                    postId={postId}
                    votesAmt={commentVotesAmt}
                  />
                </div>

                {/* Replies */}
                {comment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyCommentVotesAmt = reply.votes.reduce(
                      (acc, vote) => {
                        if (vote.type === "UP") return acc + 1;
                        if (vote.type === "DOWN") return acc - 1;
                        return acc;
                      },
                      0
                    );

                    const replyCommentVotes = reply.votes.find((vote) => {
                      vote.userId === session?.user?.id;
                    });

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyCommentVotes}
                          postId={postId}
                          votesAmt={replyCommentVotesAmt}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
