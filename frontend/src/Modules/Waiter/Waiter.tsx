import React, { FC } from "react";
import styles from "./Waiter.module.css";

interface WaiterProps {
  room: any;
}

const Waiter: FC<WaiterProps> = ({ room }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#100e17",
      color: "white",
      flexDirection: "column",
    }}
  >
    <div></div>
    <div className={styles.text}>Waiting for other Player</div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100vw",
      }}
    >
      <div style={{ color: "white", padding: "20px" }}>
        <div style={{ display: "flex" }}>
          <img
            src={room.player1_url}
            alt="Profile"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "block",
            }}
          />
          <span
            className={styles.score}
            style={{
              marginLeft: "5px",
              paddingTop: "10px",
            }}
          >
            {room.player1_score}
          </span>
        </div>
      </div>
      <div style={{ color: "white", padding: "20px" }}>
        <div style={{ display: "flex" }}>
          <span
            className={styles.score}
            style={{
              marginRight: "5px",
              paddingTop: "10px",
            }}
          >
            {room.player2_score}
          </span>
          <img
            src={
              room.player2
                ? room.player2_url
                : "https://media.istockphoto.com/vectors/waiting-icon-vector-sign-and-symbol-isolated-on-white-background-vector-id1029720470?k=6&m=1029720470&s=170667a&w=0&h=Jj71N5y7TwYnqCblQZnKZTCF5zOjknUWEchBRJza_wc="
            }
            alt="Profile"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export default Waiter;
