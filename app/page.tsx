// yorkie-js-sdk is only work on client-side.
"use client";

import styles from "./page.module.css";
import React, { useEffect, useState } from "react";

// import createClient from "./utils/connectToYorkie";
import * as yorkie from "yorkie-js-sdk";

async function attachDoc(
  client: yorkie.Indexable,
  doc: yorkie.Indexable,
) {
  await client.activate();
  await client.attach(doc);
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // Yorkie Document declaration
  // const [doc] = useState<yorkie.Document<yorkie.Indexable>>(() => new yorkie.Document("my-doc"));
  // const [test, setTest] = useState([]);

  useEffect(() => {
    // create Yorkie Client, Document at server-side
    // const client = createClient();
    const client = new yorkie.Client('http://localhost:8080', {
      apiKey: "",
    });

    const doc = new yorkie.Document('test')

    // attach Document into the Client
    attachDoc(client, doc)
      .then(() => {
        console.log("attach document to client success");
      })
      .catch((e: Error) => {
        console.log(e);
      });

    client.subscribe((event: yorkie.Indexable) => {
      if (event.type === "stream-connection-status-changed") {
        event.value === "connected"
          ? setIsConnected(true)
          : setIsConnected(false);
      }
    });
  }, []);

  return (
    <main className={styles.main}>
      <h1>state : {isConnected ? "connected" : "disconnected"}</h1>
    </main>
  );
}