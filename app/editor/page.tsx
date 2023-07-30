// yorkie-js-sdk is only work on client-side.
"use client";

import styles from "../page.module.css";
import React, { useEffect, useState } from "react";
import { useRouter, redirect } from "next/navigation";

import { ContentTypes } from "../utils/types";
import yorkie, { Text, Document, JSONArray } from "yorkie-js-sdk";
import { displayPeers } from "../utils/displayPeers";
import TextEditor from "./textEditor";

const DEFAULT_CONTENT: JSONArray<ContentTypes> = [
  {
    date: "27-07-23",
    text: "Garry's birthday",
  },
  {
    date: "15-07-23",
    text: "payday",
  },
];

const DOCUMENT_KEY = `next.js-example-${new Date()
  .toISOString()
  .substring(0, 10)
  .replace(/-/g, "")}`;

export default function Editor() {
  const navigate = useRouter();
  const userName = window.localStorage.getItem("name");

  const [peers, setPeers] = useState<any>([userName]);
  const [content, setContent] = useState<Array<ContentTypes>>(DEFAULT_CONTENT);

  // create Yorkie Client at client-side
  const client = new yorkie.Client("https://api.yorkie.dev", {
    apiKey: "cedaovjuioqlk4pjqn6g",
    presence: {
      userName: `${userName}`,
    },
  });

  const [doc] = useState<Document<{ content: JSONArray<ContentTypes> }>>(
    () =>
      new yorkie.Document<{ content: JSONArray<ContentTypes> }>(DOCUMENT_KEY),
  );

  const logOut = async () => {
    window.localStorage.removeItem("name");
    await client.deactivate();
    window.location.replace("/");
  };

  const actions = {
    addContent(date: string, text: string) {
      doc.update(root => {
        root.content.push({ date, text });
      });
    },

    deleteContent(date: string) {
      doc.update(root => {
        let target;
        for (const item of root.content) {
          if (item.date === date) {
            target = item as any;
            break;
          }
        }

        if (target) {
          root.content.deleteByID!(target.getID());
        }
      });
    },

    updateContent(date: string, text: string) {
      doc.update(root => {
        let target;
        for (const item of root.content) {
          if (item.date === date) {
            target = item;
            break;
          }
        }

        if (target) {
          target.text = text;
        }
      });
    },

    initContent() {
      doc.update(root => {
        let target;
        for (const item of root.content) {
          target = item as any;
          root.content.deleteByID!(target.getID());
        }
      }, "");
    },
  };

  useEffect(() => {
    if (!window.localStorage.getItem("name")) {
      redirect("/");
    }

    client.subscribe(event => {
      if (event.type === "peers-changed") {
        setPeers(displayPeers(client.getPeersByDocKey(doc.getKey())));
      }
    });

    async function attachDoc(
      doc: Document<{ content: JSONArray<ContentTypes> }>,
      callback: (props: any) => void,
    ) {
      await client.activate();
      await client.attach(doc);

      doc.update(root => {
        if (!root.content) {
          root.content = DEFAULT_CONTENT;
        }
      }, "create default content if not exists");

      doc.subscribe(event => {
        callback(doc.getRoot().content);
      });

      callback(doc.getRoot().content);
    }

    attachDoc(doc, content => setContent(content));
  }, []);

  return (
    <main className={styles.main}>
      <button className="button" onClick={logOut}>
        log out
      </button>
      <hr />
      <TextEditor content={content} peers={peers} actions={actions} />
      <hr />
    </main>
  );
}
