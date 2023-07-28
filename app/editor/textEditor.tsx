"use client";

import React, { useState, useEffect } from "react";

import { DocTypes } from "../utils/types";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'

export default function TextEditor(props: DocTypes) {
  const { content, peers } = props;

  return (
    <>
      <ul>
        {peers.map((item: any) => {
          return <li>{item}</li>;
        })}
      </ul>
      <hr />
      <div>
        <p>{JSON.stringify(content)}</p>
        <Calendar 
          formatDay={(locale, date) =>
            date.toLocaleString('en', { day: 'numeric' })
          }
        />
      </div>
    </>
  );
}
