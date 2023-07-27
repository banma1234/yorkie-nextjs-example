// yorkie-js-sdk is only work on client-side.
"use client";

import styles from "../page.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ContentType } from "../utils/types";
import yorkie, { Text, Document } from "yorkie-js-sdk";

const documentKey = `next.js-example-${new Date()
  .toISOString()
  .substring(0, 10)
  .replace(/-/g, "")}`;

export default function Editor() {
  const navigate = useRouter();
  const userName = window.localStorage.getItem("name");

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [content, setContent] = useState<Text>();
  // create Yorkie Doc by useState, to change the state of docs dynamically
  const [doc] = useState<Document<ContentType>>(
    () => new yorkie.Document<ContentType>(documentKey),
  );

  const logOut = () => {
    window.localStorage.removeItem("name");
    navigate.push("/");
  };

  useEffect(() => {
    // create Yorkie Client at client-side
    const client = new yorkie.Client("http://localhost:8080", {
      apiKey: "",
      presence: {
        userName: `${userName}`,
      },
    });

    async function attachDoc(
      doc: Document<ContentType>,
      callback: (content: Text) => void,
    ) {
      await client.activate;
      await client.attach(doc);

      doc.update(root => {
        if (!root.content) {
          root.content = new yorkie.Text();
          root.content.edit(0, 0, "/n");
        }
      }, "create default content if not exists");

      doc.subscribe(event => {
        callback(doc.getRoot().content);
      });
    }

    attachDoc(doc, content => setContent(content));
  }, []);

  return (
    <main className={styles.main}>
      {/* <h1>state : {isConnected ? "connected" : "disconnected"}</h1> */}
      <p>name : {userName}</p>
      <hr />
      <button onClick={logOut}>log out</button>
    </main>
  );
}
