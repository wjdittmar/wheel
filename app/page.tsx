"use client";
import styles from "./page.module.css";
import { JSX, useEffect, useCallback } from "react";
import { apiClient } from "@/services/apiClient";
export default function Home(): JSX.Element {
  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  // useCallback otherwise fetchData is recreated on every render
  const fetchData = useCallback(async (url: string) => {
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
    fetchData("https://jsonplaceholder.typicode.com/posts");
  }, [fetchData]);

  return <div className={styles.page}></div>;
}
