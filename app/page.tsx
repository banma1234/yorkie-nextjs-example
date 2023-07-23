// yorkie-js-sdk is only work on client-side.
"use client";

import styles from "./page.module.css";
import React, { useEffect, useState } from "react";

import * as yorkie from "yorkie-js-sdk";

async function connectToYorkie(
  client: yorkie.Indexable,
  doc: yorkie.Indexable,
) {
  await client.activate();
  await client.attach(doc);
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Yorkie Client declaration
    const client = new yorkie.Client("http://localhost:8080", {
      apiKey: "",
    });
    // Yorkie Document declaration
    const doc = new yorkie.Document("doc-1");

    connectToYorkie(client, doc)
      .then(() => {
        console.log("success");
      })
      .catch((e: Error) => {
        console.log(e);
      });

    client.subscribe(event => {
      if (event.type === "stream-connection-status-changed") {
        event.value === "connected"
          ? setIsConnected(true)
          : setIsConnected(false);
      }
    });
  });

  return (
    <main className={styles.main}>
      <h1>state : {isConnected ? "connected" : "disconnected"}</h1>
    </main>
  );
}
