"use client";

import React, { useState } from "react";
import "./calendar.css";
import styles from "./page.module.css";

import { EditorPropsTypes, CalendarValue } from "../utils/types";
import { parseDate } from "../utils/parseDate";
import Calendar from "react-calendar";

export default function Sceduler(props: EditorPropsTypes) {
  const { content, peers, actions } = props;
  const [date, onChange] = useState<CalendarValue>(new Date());
  const [text, setText] = useState<string>("Enter text here!");

  const currentDate = date ? parseDate(new Date(date.toString())) : "";

  const eventHandler = (event: string) => {
    switch (event) {
      case "PUSH":
        let flag = false;
        content.forEach(item => {
          if (item.date === currentDate) {
            flag = !flag;
            return 0;
          }
        });

        flag
          ? actions.updateContent(currentDate, text)
          : actions.addContent(currentDate, text);

        setText("Enter text here!");
        break;
      case "DELETE":
        actions.deleteContent(currentDate);
        break;
    }
  };

  return (
    <article>
      <p>
        peers : [
        {peers.map((man: string, i: number) => {
          return <span key={i}> {man}, </span>;
        })}
        ]
      </p>
      <div>
        <Calendar
          onChange={onChange}
          value={date}
          locale="en-EN"
          showNeighboringMonth={false}
          formatDay={(locale, date) =>
            date.toLocaleString("en", { day: "numeric" })
          }
          tileClassName={({ date }) =>
            content.find(item => item.date === parseDate(date))
              ? "highlight"
              : ""
          }
        />
        <p>selected day : {currentDate}</p>
        <div className={styles.memo}>
          {content.map((item, i: number) => {
            if (item.date === currentDate) {
              return <p key={i}>{item.text}</p>;
            }
          })}
        </div>
        <div className={styles.inputForm_editor}>
          <h3>input form</h3>
          <textarea
            className={styles.textArea}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
          />
        </div>
        <button className="button" onClick={() => eventHandler("PUSH")}>
          push
        </button>
        <button className="button" onClick={() => eventHandler("DELETE")}>
          pop
        </button>
      </div>
    </article>
  );
}
