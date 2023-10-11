import { INFINITE_SCROLL_OFFSET } from "@/config";
import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "./PostFeed";

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedSubreddits = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedSubreddits.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLL_OFFSET,
  });

  //   @ts-ignore
  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
