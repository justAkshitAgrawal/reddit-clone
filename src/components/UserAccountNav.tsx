"use client";

import { User } from "next-auth";
import React, { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar className="h-8 w-8" user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className=" bg-white" align="end">
        <div className="flex items-center justify-center gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="text-sm font-medium">{user.name}</p>}
            {user.email && (
              <p className="text-xs w-[200px] truncate  text-gray-500">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/"} className=" cursor-pointer">
            Feed
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/r/create"} className=" cursor-pointer">
            Create a Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/settings"} className=" cursor-pointer">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div
            className="flex cursor-pointer"
            onClick={() => {
              signOut({
                callbackUrl: `${window.location.origin}/sign-in`,
              });
            }}
          >
            Sign Out <ExitIcon className="w-4 h-4 ml-1" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
