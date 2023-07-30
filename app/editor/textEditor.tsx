"use client";

import React, { useState } from "react";
import "./calendar.css";
import styles from "./page.module.css";

import { EditorPropsTypes, CalendarValue } from "../utils/types";
import Calendar from "react-calendar";
import moment from "moment";

export default function TextEditor(props: EditorPropsTypes) {
  const { content, peers, actions } = props;
  const [date, onChange] = useState<CalendarValue>(new Date());
  const [text, setText] = useState<string>("Enter text here!");

  const currentDate = moment(date?.toString()).format("DD-MM-YYYY");

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
    <>
      <p>
        peers : [
        {peers.map((man: string) => {
          return <span> {man}, </span>;
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
            content.find(
              item => item.date === moment(date).format("DD-MM-YYYY"),
            )
              ? "highlight"
              : ""
          }
        />
        <p>selected day : {currentDate}</p>
        <div className={styles.memo}>
          {content.map(item => {
            if (item.date === currentDate) {
              return <p>{item.text}</p>;
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
    </>
  );
}
