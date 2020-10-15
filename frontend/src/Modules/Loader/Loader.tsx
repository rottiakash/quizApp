import React, { FC } from "react";
import styles from "./Loader.module.css";
const Loader: FC = () => {
  return (
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
      <div className={styles.text}>Loading...</div>
    </div>
  );
};

export default Loader;
