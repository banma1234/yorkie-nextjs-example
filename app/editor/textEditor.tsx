"use client";

import React, { useState, useEffect } from "react";
import { DocTypes } from "../utils/types";

export default function TextEditor(props: DocTypes) {
  const { content, peers } = props;

  return (
    <>
      <h1>hi</h1>
      <hr />
      <ul>
        {peers.map((item: any) => {
          return <li>{item}</li>;
        })}
      </ul>
      <br />
      <div>
        <p>{JSON.stringify(content)}</p>
      </div>
    </>
  );
}
