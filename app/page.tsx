import React from "react";
import { getFrameMetadata } from "frog/next";
import type { Metadata } from "next";

import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const frameTags = await getFrameMetadata(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api`
  );
  return {
    title: "LP Points Frame",
    description: "Frame to check your liquidity mining points",
    authors: [
      {
        name: "@leovido.eth",
        url: "https://github.com/leovido",
      },
    ],
    applicationName: "LP points frame",
    creator: "@leovido.eth",
    other: frameTags,
  };
}

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 style={{ color: "white" }}>LP points frame</h1>
    </main>
  );
}
