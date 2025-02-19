"use client";

import { JSX, useEffect, useCallback } from "react";
import { useState } from "react";
import { apiClient } from "./lib/api/clientApiClient";

import { GithubUser } from "@/types/github";
import { Post } from "@/types/post";

async function getGitHubUser(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`GitHub API request failed with status: ${res.status}`);
    }

    return (await res.json()) as GithubUser;
  } catch (error) {
    console.error("Failed to fetch GitHub user:", error);
    throw error;
  }
}

export default function Home(): JSX.Element {
  const [user, setUser] = useState<GithubUser>();
  // useCallback otherwise fetchData is recreated on every render
  const fetchData = useCallback(async (url: string) => {
    try {
      const user = await getGitHubUser(url);
      setUser(user);
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData("/api/github/users/octocat");
  }, [fetchData]);

  const fetchPostData = useCallback(async (url: string) => {
    try {
      const response = await apiClient.get<Post[]>(url);
      response.data.forEach((post) => {
        console.log(post.id);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPostData("https://jsonplaceholder.typicode.com/posts");
  }, [fetchPostData]);

  return (
    <img
      src={user?.avatar_url || "/default-avatar.png"}
      alt={`${user?.name || "User"} avatar`}
      width={500}
      height={500}
    />
  );
}
