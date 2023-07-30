"use client";

import React, { useState, useEffect } from "react";

import { EditorPropsTypes, CalendarValue, ChangeEventHandler } from "../utils/types";
import Calendar from "react-calendar";
import './calendar.css'
import moment from "moment";

export default function TextEditor(props: EditorPropsTypes) {
  const { content, peers, mark, actions } = props;
  const [ date, onChange ] = useState<CalendarValue>(new Date());
  // const [ mark, setMark ] = useState<Array<string>>(["02-07-2023", "12-07-2023"]);

  const currentDate = moment(date?.toString()).format("DD-MM-YYYY");

  // const test = (date: any) => {
  //   setMark(mark.filter((e) => {return e != date}))
  // }

  return (
    <>
      <ul>
        {peers.map((item: any) => {
          return <li>{item}</li>;
        })}
      </ul>
      <hr />
      <div>
        <Calendar 
          onChange={onChange}
          value={date}
          locale="en-EN"
          showNeighboringMonth={false}
          formatDay={(locale, date) =>
            date.toLocaleString('en', { day: 'numeric' })
          }
          tileClassName={({ date }) => mark.find((x) => x === moment(date).format("DD-MM-YYYY")) ? "highlight" : ""}
        />
        <p>currentDate : {currentDate}</p>
        {mark.map((e: any) => {
          return(
            <p>{e}</p>
          )
        })}
        <button onClick={() => actions.addMark(currentDate)}>push</button>
        <button onClick={() => actions.deleteMark(currentDate)}>pop</button>
        <button onClick={() => alert(mark)}>print</button>
      </div>
    </>
  );
}

// view === 'month' && date.getDay() === 3 ? 'wednesday' : null

// {
//   // if (example.find((x) => x === moment(date).format("DD-MM-YYYY"))) {
//   //   return "highlight";
//   // }
//   view === 'month' && date.getDay() === 3 ? 'wednesday' : null
// }