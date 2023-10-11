import { User } from "next-auth";
import React, { FC } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Icons } from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user?.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            height={150}
            width={150}
            src={user.image}
            alt="Profile Pic"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          {user?.name?.slice(0, 2).toUpperCase()}
          <Icons.user />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
