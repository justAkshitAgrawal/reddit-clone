import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLL_OFFSET } from "@/config";
import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import React from "react";

const SubredditPage = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },

        take: INFINITE_SCROLL_OFFSET,
      },
    },
  });

  if (!subreddit) {
    return notFound();
  }

  return (
    <>
      <h1 className=" font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />

      {/* TODO: Show Posts */}
      {/* @ts-ignore */}
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default SubredditPage;
