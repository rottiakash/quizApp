import React, { FC } from "react";
import styles from "./Waiter.module.css";
const Waiter: FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#100e17",
      color: "white",
    }}
  >
    <div className={styles.text}>Waiting for other Player</div>
  </div>
);

export default Waiter;
