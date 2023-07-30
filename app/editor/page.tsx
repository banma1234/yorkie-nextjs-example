// yorkie-js-sdk is only work on client-side.
"use client";

import styles from "../page.module.css";
import React, { useEffect, useState } from "react";
import { useRouter, redirect } from "next/navigation";

import { DocTypes } from "../utils/types";
import yorkie, { Text, Document, JSONArray } from "yorkie-js-sdk";
import { displayPeers } from "../utils/displayPeers";
import TextEditor from "./textEditor";
import { it } from "node:test";

const DEFAULT_CONTENT: Text = new yorkie.Text();

const DOCUMENT_KEY = `next.js-example-${new Date()
  .toISOString()
  .substring(0, 10)
  .replace(/-/g, "")}`;

export default function Editor() {
  const navigate = useRouter();
  const userName = window.localStorage.getItem("name");
  // create Yorkie Doc by useState, to change the state of docs dynamically
  const [doc] = useState<Document<DocTypes>>(
    () => new yorkie.Document<DocTypes>(DOCUMENT_KEY),
  );
  const [content, setContent] = useState<Text>(DEFAULT_CONTENT);
  const [peers, setPeers] = useState<any>([userName]);
  const [ mark, setMark ] = useState<Array<string>>([]);

  const logOut = () => {
    window.localStorage.removeItem("name");
    navigate.push("/");
  };

  const actions = {
    addMark(date: string) {
      doc.update((root) => {
        root.mark.push(date)
      })
    },

    deleteMark(date: string) {
      doc.update((root) => {
        let target;
        for (const item of root.mark) {
          // console.log("item : ", JSON.stringify(item))
          if (JSON.stringify(item).includes(date)) {
            target = item as any;
            break;
          }
        }

        if (target) {
          root.mark.deleteByID!(target.getID());
        }
      })
    }
  }

  useEffect(() => {
    if (!window.localStorage.getItem("name")) {
      redirect("/");
    }

    // create Yorkie Client at client-side
    const client = new yorkie.Client("https://api.yorkie.dev", {
      apiKey: "cedaovjuioqlk4pjqn6g",
      presence: {
        userName: `${userName}`,
      },
    });

    client.subscribe(event => {
      if (event.type === "peers-changed") {
        setPeers(displayPeers(client.getPeersByDocKey(doc.getKey())));
      }
    });

    async function attachDoc(
      doc: Document<DocTypes>,
      callback: (props: any) => void,
    ) {
      await client.activate();
      await client.attach(doc);

      doc.update(root => {
        // if (!root.content) {
        //   root.content = new yorkie.Text();
        //   root.content.edit(0, 0, "Enter text here!");
        // }
        if (!root.mark) {
          root.mark = ["02-07-2023", "12-07-2023"];
        }
      }, "create default content if not exists");

      doc.subscribe(event => {
        // callback(doc.getRoot().content);
        callback(doc.getRoot().mark);
      });

      // callback(doc.getRoot().content);
      callback(doc.getRoot().mark);
    }

    // attachDoc(doc, content => setContent(content));
    attachDoc(doc, mark => setMark(mark));
  }, []);

  return (
    <main className={styles.main}>
      <p>me : {userName}</p>
      <hr />
      <TextEditor content={content} mark={mark} peers={peers} actions={actions} />
      <hr />
      <button onClick={logOut}>log out</button>
    </main>
  );
}
