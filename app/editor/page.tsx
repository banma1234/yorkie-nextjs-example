// yorkie-js-sdk is only work on client-side.
"use client";

import styles from "../page.module.css";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import { ContentTypes } from "../utils/types";
import { displayPeers } from "../utils/displayPeers";
import { parseDate } from "../utils/parseDate";
import yorkie, { Document, JSONArray } from "yorkie-js-sdk";
import Sceduler from "./Sceduler";

const DEFAULT_CONTENT: JSONArray<ContentTypes> = [
  {
    date: parseDate(new Date()).replace(/^\d{2}/, "01"),
    text: "payday",
  },
  {
    date: parseDate(new Date()).replace(/^\d{2}/, "17"),
    text: "Garry's birthday",
  },
];

// parseDate() value's format = "DD-MM-YYYY"
const DOCUMENT_KEY = `next.js-Sceduler-${parseDate(new Date())}`;

export default function Editor() {
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

  // create Yorkie Document with useState value to handle doc dynamically
  const [doc] = useState<Document<{ content: JSONArray<ContentTypes> }>>(
    () =>
      new yorkie.Document<{ content: JSONArray<ContentTypes> }>(DOCUMENT_KEY),
  );

  const logOut = async () => {
    window.localStorage.removeItem("name");
    // disconnect client
    await client.deactivate();
    window.location.replace("/");
  };

  const actions = {
    // push new content to Yorkie's database
    addContent(date: string, text: string) {
      doc.update(root => {
        root.content.push({ date, text });
      });
    },

    // delete selected content at Yorkie's database
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
          // delete content with keyValue
          root.content.deleteByID!(target.getID());
        }
      });
    },

    // edit selected content at Yorkie's database
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
      <Sceduler content={content} peers={peers} actions={actions} />
    </main>
  );
}
