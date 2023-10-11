"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["search-query"],
    enabled: false,
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
  });

  const commandRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const request = debounce(async () => {
    await refetch();
  }, 300);

  const debounceReq = useCallback(() => {
    request();
  }, []);

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      ref={commandRef}
      className=" relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        className=" outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search for subreddits..."
        value={input}
        onValueChange={(value) => {
          setInput(value);
          debounceReq();
        }}
      />
      {input.length > 0 && (
        <CommandList className=" absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="subreddits">
              {queryResults?.map((subreddit) => {
                return (
                  <CommandItem
                    onSelect={() => {
                      router.push(`/r/${subreddit.name}`);
                      router.refresh();
                    }}
                    key={subreddit.id}
                    value={subreddit.name}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <a href={`/r/${subreddit.name}`}>
                      <span className="text-sm font-medium text-zinc-700">
                        {subreddit.name}
                      </span>
                    </a>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
