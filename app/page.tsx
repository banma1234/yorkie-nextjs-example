"use client";

import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Main() {
  const navigate = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (window.localStorage.getItem("name")) {
      navigate.push("/editor");
    }
  }, []);

  const handleSubmit = () => {
    window.localStorage.setItem("name", userName);
    navigate.push("/editor");
  };

  return (
    <main className={styles.inputForm}>
      <input
        placeholder="your name?"
        value={userName}
        onChange={e => {
          setUserName(e.target.value);
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}
