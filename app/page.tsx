"use client";

import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";

export default function Main() {
  const navigate = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (window.localStorage.getItem("name")) {
      redirect("/editor");
    }
  }, []);

  const handleSubmit = () => {
    window.localStorage.setItem("name", userName);
    navigate.push("/editor");
  };

  return (
    <main className={styles.main}>
      <h1>Enter your name</h1>
      <section className={styles.inputForm}>
        <input
          placeholder="your name?"
          value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }}
        />
        <button className="button" onClick={handleSubmit}>
          Submit
        </button>
      </section>
    </main>
  );
}
